import ast
import pandas as pd
import pickle
import os
import shutil
import datetime
import numpy as np
from lightfm import LightFM
from lightfm.cross_validation import random_train_test_split
from lightfm.data import Dataset
import numpy as numpy
from recommenders.utils.timer import Timer
from recommenders.models.lightfm.lightfm_utils import (
    similar_users,
    similar_items,
)

BASE_PATH = os.path.dirname(__file__)
Read_DIR = "lib"
Backup_DIR = "lib_backup"

class LightFM_cls:
    def __init__(self) -> None:
        self.model = pickle.load(open(os.path.join(BASE_PATH, Read_DIR, "model.pkl"), 'rb'))
        self.user_features = pickle.load(open(os.path.join(BASE_PATH, Read_DIR, "user_features.pkl"), 'rb'))
        self.item_features = pickle.load(open(os.path.join(BASE_PATH, Read_DIR, "item_features.pkl"), 'rb'))
        self.dataset = pickle.load(open(os.path.join(BASE_PATH, Read_DIR, "dataset_builder.pkl"), 'rb'))
        self.user_mapper,self.user_fmapper,self.item_mapper,self.item_fmapper = self.dataset.mapping()
        self.ruser_mapper = dict([(v,k) for k,v in self.user_mapper.items()])
        self.ritem_mapper = dict([(v,k) for k,v in self.item_mapper.items()])
        self.ruser_fmapper = dict([(v,k) for k,v in self.user_fmapper.items()])
        self.ritem_fmapper = dict([(v,k) for k,v in self.item_fmapper.items()])
        self.user_meta = pd.read_csv(os.path.join(BASE_PATH, Read_DIR,"user_meta.csv"))
        self.item_meta = pd.read_csv(os.path.join(BASE_PATH, Read_DIR, "item_meta.csv"))

    def similar_existing_user(self,original_user_id,N=10):
        try:
            user_id = self.user_mapper[original_user_id]
        except Exception as e:
            raise KeyError("Given User Id is not present in Model")
        udf = similar_users(user_id=user_id, 
              user_features=self.user_features, 
              model=self.model,
              N=N)
        udf['all_unique_id'] = udf['userID'].map(self.ruser_mapper)
        udf.columns = 'left_' + udf.columns.values
        matched_user_meta = udf.merge(self.user_meta,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_user_meta
    
    def similar_existing_item(self,original_item_id,N=10):
        try:
            item_id = self.item_mapper[original_item_id]
        except Exception as e:
            raise KeyError("Given Item Id is not present in Model")
        idf = similar_items(item_id=item_id, 
              item_features=self.item_features, 
              model=self.model,
              N=N)
        idf['all_unique_id'] = idf['itemID'].map(self.ritem_mapper)
        idf.columns = 'left_' + idf.columns.values
        matched_item_meta = idf.merge(self.item_meta,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_item_meta
    
    def cold_start_similar_items(self,new_item_attriutes, N=10):
        feat_idxs = [self.item_fmapper.get(key) for key in new_item_attriutes]
        i_biases, item_representations = self.model.get_item_representations(features=self.item_features)
        summation = 0
        for idx in feat_idxs:
            summation += (self.model.item_embeddings[idx] )
        scores = item_representations.dot(summation)
        item_norms = np.linalg.norm(item_representations, axis=1)
        item_vec_norm = np.linalg.norm(summation)
        scores = np.squeeze(scores / item_norms / item_vec_norm)

        best = np.argsort(-scores)[0 : N]
        idf = sorted(zip(best, scores[best]), key=lambda x: -x[1])
        idf = pd.DataFrame(idf,columns=['itemID','score'])
        idf['all_unique_id'] = idf['itemID'].map(self.ritem_mapper)
        idf.columns = 'left_' + idf.columns.values
        matched_item_meta = idf.merge(self.item_meta,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_item_meta
    
    def user_item_recommendation(self,original_user_id):
        try:
            user_id = self.user_mapper[original_user_id]
        except Exception as e:
            raise KeyError("Given User Id is not present in Model")
        scores = self.model.predict(user_id, np.arange(len(self.item_mapper)))
        top_items = self.item_meta.iloc[np.argsort(-scores)].copy()
        top_items.insert(0, 'ranking_score', list(-np.sort(-scores)))
        return top_items[['all_unique_id','title','ranking_score']].rename(columns={"ranking_score":"score"})
    
    def cold_start_user_item_recommendation(self,new_user_attriutes):
        new_user_features = self.dataset.build_user_features([("test_profile_id1",new_user_attriutes)])
        scores_new_user = self.model.predict(user_ids = 0,item_ids = np.arange(len(self.item_mapper)), user_features=new_user_features)
        top_items_new = self.item_meta.iloc[np.argsort(-scores_new_user)].copy()
        top_items_new.insert(0, 'ranking_score', list(-np.sort(-scores_new_user)))
        return top_items_new[['all_unique_id','title','tags','ranking_score']].rename(columns={"ranking_score":"score"})

    def Re_Train(self,new_user_meta,new_item_meta,new_user_item_interactions,attr_list,df_users,df_items):
        dataset = Dataset()
        dataset.fit(users=new_user_meta['userID'], ## new 
            items=new_item_meta['itemID'],
            item_features=attr_list,
            user_features=attr_list)

        item_features = dataset.build_item_features([(x,y) for x,y in zip(new_item_meta['itemID'],new_item_meta['item_attr_list'])])
        user_features = dataset.build_user_features([(x,y) for x,y in zip(new_user_meta['userID'],new_user_meta['user_attr_list'])])
        (interactions, weights) = dataset.build_interactions((x, y) for x,y in zip(new_user_item_interactions['userID'],new_user_item_interactions['itemID']))
        n_components = 30
        loss = 'warp'
        epoch = 30
        num_thread = 4
        with Timer() as Train_timer:
            model = LightFM(no_components= n_components, loss=loss, random_state = 1616)
            model.fit(interactions,  user_features= user_features, item_features= item_features, epochs=epoch,num_threads = num_thread, sample_weight = weights)
        print(f"Took {Train_timer.interval:.1f} seconds for Training the Model.")

        shutil.copytree(os.path.join(BASE_PATH, Read_DIR),os.path.join(BASE_PATH, Backup_DIR,"Backup-"+str(datetime.datetime.now())))

        with open(os.path.join(BASE_PATH, Read_DIR, 'model.pkl'), 'wb') as fle:
            pickle.dump(model, fle, protocol=pickle.HIGHEST_PROTOCOL)
        with open(os.path.join(BASE_PATH, Read_DIR, 'user_features.pkl'), 'wb') as fle:
            pickle.dump(user_features, fle, protocol=pickle.HIGHEST_PROTOCOL)
        with open(os.path.join(BASE_PATH, Read_DIR, 'item_features.pkl'), 'wb') as fle:
            pickle.dump(item_features, fle, protocol=pickle.HIGHEST_PROTOCOL)
        with open(os.path.join(BASE_PATH, Read_DIR, 'dataset_builder.pkl'), 'wb') as fle:
            pickle.dump(dataset, fle, protocol=pickle.HIGHEST_PROTOCOL)

        df_users.to_csv(os.path.join(BASE_PATH, Read_DIR, "user_meta.csv"))
        df_items.to_csv(os.path.join(BASE_PATH, Read_DIR, "item_meta.csv"))
        
        self.__init__()  #### Re-Initialize the Model Variables
        return True

    def Example_Train(self,new_user_meta,new_item_meta,new_user_item_interactions,attr_list):
        """
        Example listings as shown in dummy function: function name
        This would help you reference in xyz scenario
        """
        # all_user_unq_list=["unq_id-x1","unq_id-x2"]
        # all_item_unq_list=['1234567','2345678']
        # user_feature_list = [["attr1","attr2"],["attr2","attr3"]]
        # item_feature_list = [["attr1","attr2"],["attr2","attr3"]]
        # all_user_feature_list = ["attr1","attr2","attr3"]
        # all_item_feature_list = ["attr1","attr2","attr3"]
        # list_interaction_user_id = ['unq_id-x1']
        # list_interaction_item_id = ['1234567']
        # dataset = Dataset()
        # dataset.fit(users=all_user_unq_list, ## new 
        #     items=all_item_unq_list,
        #     item_features=all_item_feature_list,
        #     user_features=all_user_feature_list)
        # item_features = dataset.build_item_features([(x,y) for x,y in zip(all_item_unq_list,item_feature_list)]) ## new
        # user_features = dataset.build_user_features([(x,y) for x,y in zip(all_user_unq_list,user_feature_list)]) ## new
        # (interactions, weights) = dataset.build_interactions((x, y) for x,y in zip(list_interaction_user_id,list_interaction_item_id))

        # train, test = random_train_test_split(interactions,test_percentage=0.12, random_state=779)
        # train_w, test_w = random_train_test_split(weights, test_percentage=0.12, random_state=779)
        # n_components = 30
        # loss = 'warp'
        # epoch = 30
        # num_thread = 4
        # with Timer() as Train_timer:
        #     model = LightFM(no_components= n_components, loss=loss, random_state = 1616)
        #     model.fit(train,  user_features= user_features, item_features= item_features, epochs=epoch,num_threads = num_thread, sample_weight = train_w)
        # print(f"Took {Train_timer.interval:.1f} seconds for Training the Model.")
        return None
