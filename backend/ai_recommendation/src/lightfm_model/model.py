import ast
import pandas as pd
import pickle
import os
import shutil
import datetime
import numpy as np
import json
import itertools
from pathlib import Path
from lightfm import LightFM
from lightfm.cross_validation import random_train_test_split
from lightfm.data import Dataset
import numpy as numpy
from recommenders.utils.timer import Timer
from recommenders.models.lightfm.lightfm_utils import (
    similar_users,
    similar_items,
)
from sentence_transformers import SentenceTransformer

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
        self.interaction_meta = pd.read_csv(os.path.join(BASE_PATH, Read_DIR, "interaction_meta.csv"))
        self.user_meta['tags'] = self.user_meta['tags'].apply(lambda eachList : list(map(lambda x: x.strip().lower(),ast.literal_eval(eachList))))
        self.item_meta['tags'] = self.item_meta['tags'].apply(lambda eachList : list(map(lambda x: x.strip().lower(),ast.literal_eval(eachList))))
        self.text_encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

    def encode_textual_data(self, textual_data):
        """Encode textual data using the sentence transformer model."""
        return self.text_encoder.encode(textual_data, convert_to_tensor=True)

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
    
    def cold_start_similar_user(self,filter_dict,hard_filter_attrs,soft_filter_attrs,Global_Obj,N=10):
        filter_udf = self.user_meta[self.user_meta['tags'].apply(lambda eachList : set(hard_filter_attrs).issubset(set(eachList)))].copy()
        for each_semi_hard_filter in Global_Obj.semi_hard_filters:
            filter_udf = filter_udf[filter_udf['tags'].apply(lambda eachList : bool(set(filter_dict[each_semi_hard_filter]).intersection(eachList)))]
        filter_udf.reset_index(drop=True,inplace=True)
        feat_idxs = [self.user_fmapper.get(key) for key in soft_filter_attrs]
        u_biases, user_representations = self.model.get_user_representations(features=self.user_features)

        summation = 0
        for idx in range(len(feat_idxs)):
            summation += (self.model.user_embeddings[feat_idxs[idx]] )
        filter_user_embeddings = []
        for idx in filter_udf['all_unique_id'].tolist():
            filter_user_embeddings.append(user_representations[self.user_fmapper[idx]])
        filter_user_embeddings = np.array(filter_user_embeddings)
        scores = filter_user_embeddings.dot(summation)
        user_norms = np.linalg.norm(filter_user_embeddings, axis=1)
        user_vec_norm = np.linalg.norm(summation)
        scores = np.squeeze(scores / user_norms / user_vec_norm)
        scores = scores.reshape(-1)
        best = np.argsort(-scores)[0 : N]
        udf = sorted(zip(best, scores[best]), key=lambda x: -x[1])
        udf = pd.DataFrame(udf,columns=['userID','score'])
        udf['all_unique_id'] = udf['userID'].map(filter_udf['all_unique_id'].to_dict())
        udf.columns = 'left_' + udf.columns.values
        matched_user_meta = udf.merge(filter_udf,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_user_meta
    
    def cold_start_similar_items(self,hard_filter_attrs,soft_filter_attrs,Global_Obj,N=10,test_sample_flag=False):
        filter_idf = self.item_meta[self.item_meta['tags'].apply(lambda eachList : set(hard_filter_attrs).issubset(set(eachList)))].copy()
        if test_sample_flag:
            filter_idf = filter_idf[filter_idf['test_set']==True].copy()
        filter_idf.reset_index(drop=True,inplace=True)
        feat_idxs = [self.item_fmapper.get(key) for key in soft_filter_attrs]
        i_biases, item_representations = self.model.get_item_representations(features=self.item_features)
        
        # soft_filter_dict = {}
        # weight_assigner = {}
        # total = 0
        # for i in Global_Obj.soft_filters:
        #     common_list = list(set(Global_Obj.cat_dict[i]) & set(soft_filter_attrs))
        #     soft_filter_dict.update({i: common_list})
        #     if len(common_list)!=0:
        #         total += Global_Obj.cat_odata[i]['manual_weights']
        #         weight_assigner.update(dict(zip(common_list,[Global_Obj.cat_odata[i]['manual_weights']/len(common_list) for _ in range(len(common_list))])))
        # weight_assigner = {k: v / total for k, v in weight_assigner.items()}
        
        summation = 0
        for idx in range(len(feat_idxs)):
            summation += (self.model.item_embeddings[feat_idxs[idx]] ) ### Without Factrorizing with the weights
            # summation += (self.model.item_embeddings[feat_idxs[idx]] ) * weight_assigner[self.ritem_fmapper[feat_idxs[idx]]]
        filter_item_embeddings = []
        for idx in filter_idf['all_unique_id'].tolist():
            filter_item_embeddings.append(item_representations[self.item_fmapper[idx]])
        filter_item_embeddings = np.array(filter_item_embeddings)
        scores = filter_item_embeddings.dot(summation)
        item_norms = np.linalg.norm(filter_item_embeddings, axis=1)
        item_vec_norm = np.linalg.norm(summation)
        scores = np.squeeze(scores / item_norms / item_vec_norm)
        scores = scores.reshape(-1)
        best = np.argsort(-scores)[0 : N]
        idf = sorted(zip(best, scores[best]), key=lambda x: -x[1])
        idf = pd.DataFrame(idf,columns=['itemID','score'])
        idf['all_unique_id'] = idf['itemID'].map(filter_idf['all_unique_id'].to_dict())
        idf.columns = 'left_' + idf.columns.values
        matched_item_meta = idf.merge(filter_idf,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_item_meta
    
    def new_cold_start_similar_items(self,filter_dict,hard_filter_attrs,soft_filter_attrs,Global_Obj,N=10,min_budget=0,max_budget=None,test_sample_flag=False):
        filter_idf = self.item_meta[self.item_meta['tags'].apply(lambda eachList : set(hard_filter_attrs).issubset(set(eachList)))].copy()
        for each_semi_hard_filter in Global_Obj.semi_hard_filters:
            filter_idf = filter_idf[filter_idf['tags'].apply(lambda eachList : bool(set(filter_dict[each_semi_hard_filter]).intersection(eachList)))]
        filter_idf = filter_idf.astype({"price" : "float"})
        def_budget_filter = lambda price : (price>=min_budget) & (price<=max_budget) if max_budget else price>=min_budget
        filter_idf = filter_idf[filter_idf['price'].apply(def_budget_filter)]
        all_soft_attrs = list(itertools.chain(*map(Global_Obj.cat_dict.get,Global_Obj.soft_filters)))
        # filter_idf['matched_tags'] = filter_idf['tags'].apply(lambda eachList: list(set(eachList) & set(soft_filter_attrs)))
        filter_idf['matched_tags'] = filter_idf['tags'].apply(lambda eachList: list(set(eachList) & set(all_soft_attrs)))
        filter_idf['embedding_tags'] = filter_idf['matched_tags'].apply(lambda eachList : [*map(dict(enumerate(self.model.item_embeddings)).get,[*map(self.item_fmapper.get, eachList)])] )
        filter_idf['embedding_tags'] = filter_idf['embedding_tags'].apply(sum)
        if test_sample_flag:
            filter_idf = filter_idf[filter_idf['test_set']==True].copy()
        filter_idf.reset_index(drop=True,inplace=True)
        feat_idxs = [self.item_fmapper.get(key) for key in soft_filter_attrs]

        summation = 0
        for idx in range(len(feat_idxs)):
            summation += (self.model.item_embeddings[feat_idxs[idx]] ) ### Without Factrorizing with the weights
        
        filter_item_embeddings = np.array(filter_idf['embedding_tags'].to_list())
        scores = filter_item_embeddings.dot(summation)
        item_norms = np.linalg.norm(filter_item_embeddings, axis=1)
        item_vec_norm = np.linalg.norm(summation)
        scores = np.squeeze(scores / item_norms / item_vec_norm)
        scores = scores.reshape(-1)
        best = np.argsort(-scores)[0 : N]
        idf = sorted(zip(best, scores[best]), key=lambda x: -x[1])
        idf = pd.DataFrame(idf,columns=['itemID','score'])
        idf['all_unique_id'] = idf['itemID'].map(filter_idf['all_unique_id'].to_dict())
        idf.columns = 'left_' + idf.columns.values
        matched_item_meta = idf.merge(filter_idf,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_item_meta
    
    def user_item_recommendation(self,original_user_id):
        try:
            user_id = self.user_mapper[original_user_id]
        except Exception as e:
            raise KeyError("Given User Id is not present in Model")
        scores = self.model.predict(user_id, np.arange(len(self.item_mapper)))
        top_items = self.item_meta.iloc[np.argsort(-scores)].copy()
        top_items.insert(0, 'ranking_score', list(-np.sort(-scores)))
        return top_items
    
    def cold_start_user_item_recommendation(self,new_user_attributes,similar_user_id,min_budget=0,max_budget=None):
        new_user_features = self.dataset.build_user_features([(self.user_mapper[similar_user_id],new_user_attributes)])
        scores_new_user = self.model.predict(user_ids = self.user_mapper[similar_user_id],item_ids = np.arange(len(self.item_mapper)), user_features=new_user_features)
        top_items_new = self.item_meta.iloc[np.argsort(-scores_new_user)].copy()
        top_items_new.insert(0, 'ranking_score', list(-np.sort(-scores_new_user)))
        def_budget_filter = lambda price : (price>=min_budget) & (price<=max_budget) if max_budget else price>=min_budget
        top_items_new = top_items_new[top_items_new['price'].apply(def_budget_filter)]
        return top_items_new
    
    def cold_start_similar_items_with_text_sim(self,hard_filter_attrs,soft_filter_attrs,Global_Obj,N=10,content_attr=None,test_sample_flag=False):
        filter_idf = self.item_meta[self.item_meta['tags'].apply(lambda eachList : set(hard_filter_attrs).issubset(set(eachList)))].copy()
        if test_sample_flag:
            filter_idf = filter_idf[filter_idf['test_set']==True].copy()
        filter_idf.reset_index(drop=True,inplace=True)
        feat_idxs = [self.item_fmapper.get(key) for key in soft_filter_attrs]
        i_biases, item_representations = self.model.get_item_representations(features=self.item_features)
        
        soft_filter_dict = {}
        weight_assigner = {}
        total = 0
        for i in Global_Obj.soft_filters:
            common_list = list(set(Global_Obj.cat_dict[i]) & set(soft_filter_attrs))
            soft_filter_dict.update({i: common_list})
            if len(common_list)!=0:
                total += Global_Obj.cat_odata[i]['manual_weights']
                weight_assigner.update(dict(zip(common_list,[Global_Obj.cat_odata[i]['manual_weights']/len(common_list) for _ in range(len(common_list))])))
        weight_assigner = {k: v / total for k, v in weight_assigner.items()}
        
        summation = 0
        for idx in range(len(feat_idxs)):
            summation += (self.model.item_embeddings[feat_idxs[idx]] ) ### Without Factrorizing with the weights
            # summation += (self.model.item_embeddings[feat_idxs[idx]] ) * weight_assigner[self.ritem_fmapper[feat_idxs[idx]]]
        filter_item_embeddings = []
        for idx in filter_idf['all_unique_id'].tolist():
            filter_item_embeddings.append(item_representations[self.item_fmapper[idx]])
        filter_item_embeddings = np.array(filter_item_embeddings)
        scores = filter_item_embeddings.dot(summation)
        item_norms = np.linalg.norm(filter_item_embeddings, axis=1)
        item_vec_norm = np.linalg.norm(summation)
        scores = np.squeeze(scores / item_norms / item_vec_norm)
        scores = scores.reshape(-1)
        if content_attr:
            new_item_attr_vec = self.encode_textual_data(content_attr)
        else:
            new_item_attr_vec = self.encode_textual_data(" ".join([*soft_filter_attrs,*hard_filter_attrs]))
        text_similarity_scores = [
            np.dot(new_item_attr_vec, self.encode_textual_data(desc).T).squeeze()
            for desc in filter_idf.description
        ]
        text_similarity_scores = np.array(text_similarity_scores)

        # Normalize text similarity scores
        text_similarity_norm = np.linalg.norm(new_item_attr_vec)
        text_similarity_scores = (
            text_similarity_scores / text_similarity_norm
        )
        # Combining scores
        scores = 0.6 * scores + 0.4 * text_similarity_scores

        best = np.argsort(-scores)[0 : N]
        idf = sorted(zip(best, scores[best]), key=lambda x: -x[1])
        idf = pd.DataFrame(idf,columns=['itemID','score'])
        idf['all_unique_id'] = idf['itemID'].map(filter_idf['all_unique_id'].to_dict())
        idf.columns = 'left_' + idf.columns.values
        matched_item_meta = idf.merge(filter_idf,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_item_meta
    
    def new_cold_start_similar_items_with_text_sim(self,filter_dict,hard_filter_attrs,soft_filter_attrs,Global_Obj,N=10,content_attr=None,min_budget=0,max_budget=None,test_sample_flag=False):
        filter_idf = self.item_meta[self.item_meta['tags'].apply(lambda eachList : set(hard_filter_attrs).issubset(set(eachList)))].copy()
        for each_semi_hard_filter in Global_Obj.semi_hard_filters:
            filter_idf = filter_idf[filter_idf['tags'].apply(lambda eachList : bool(set(filter_dict[each_semi_hard_filter]).intersection(eachList)))]
        filter_idf = filter_idf.astype({"price" : "float"})
        def_budget_filter = lambda price : (price>=min_budget) & (price<=max_budget) if max_budget else price>=min_budget
        filter_idf = filter_idf[filter_idf['price'].apply(def_budget_filter)]
        all_soft_attrs = list(itertools.chain(*map(Global_Obj.cat_dict.get,Global_Obj.soft_filters)))
        # filter_idf['matched_tags'] = filter_idf['tags'].apply(lambda eachList: list(set(eachList) & set(soft_filter_attrs)))
        filter_idf['matched_tags'] = filter_idf['tags'].apply(lambda eachList: list(set(eachList) & set(all_soft_attrs)))
        filter_idf['embedding_tags'] = filter_idf['matched_tags'].apply(lambda eachList : [*map(dict(enumerate(self.model.item_embeddings)).get,[*map(self.item_fmapper.get, eachList)])] )
        filter_idf['embedding_tags'] = filter_idf['embedding_tags'].apply(sum)
        
        if test_sample_flag:
            filter_idf = filter_idf[filter_idf['test_set']==True].copy()
        filter_idf.reset_index(drop=True,inplace=True)
        feat_idxs = [self.item_fmapper.get(key) for key in soft_filter_attrs]
        i_biases, item_representations = self.model.get_item_representations(features=self.item_features)
        
        soft_filter_dict = {}
        # weight_assigner = {}
        # total = 0
        # for i in Global_Obj.soft_filters:
        #     common_list = list(set(Global_Obj.cat_dict[i]) & set(soft_filter_attrs))
        #     soft_filter_dict.update({i: common_list})
        #     if len(common_list)!=0:
        #         total += Global_Obj.cat_odata[i]['manual_weights']
        #         weight_assigner.update(dict(zip(common_list,[Global_Obj.cat_odata[i]['manual_weights']/len(common_list) for _ in range(len(common_list))])))
        # weight_assigner = {k: v / total for k, v in weight_assigner.items()}
        
        summation = 0
        for idx in range(len(feat_idxs)):
            summation += (self.model.item_embeddings[feat_idxs[idx]] ) ### Without Factrorizing with the weights
            # summation += (self.model.item_embeddings[feat_idxs[idx]] ) * weight_assigner[self.ritem_fmapper[feat_idxs[idx]]]
        filter_item_embeddings = np.array(filter_idf['embedding_tags'].to_list())
        scores = filter_item_embeddings.dot(summation)
        item_norms = np.linalg.norm(filter_item_embeddings, axis=1)
        item_vec_norm = np.linalg.norm(summation)
        scores = np.squeeze(scores / item_norms / item_vec_norm)
        scores = scores.reshape(-1)
        if content_attr:
            new_item_attr_vec = self.encode_textual_data(content_attr)
        else:
            new_item_attr_vec = self.encode_textual_data(" ".join([*soft_filter_attrs,*hard_filter_attrs]))
        text_similarity_scores = [
            np.dot(new_item_attr_vec, self.encode_textual_data(desc).T).squeeze()
            for desc in filter_idf.description
        ]
        text_similarity_scores = np.array(text_similarity_scores)

        # Normalize text similarity scores
        text_similarity_norm = np.linalg.norm(new_item_attr_vec)
        text_similarity_scores = (
            text_similarity_scores / text_similarity_norm
        )
        # Combining scores
        scores = 0.75 * scores + 0.25 * text_similarity_scores

        best = np.argsort(-scores)[0 : N]
        idf = sorted(zip(best, scores[best]), key=lambda x: -x[1])
        idf = pd.DataFrame(idf,columns=['itemID','score'])
        idf['all_unique_id'] = idf['itemID'].map(filter_idf['all_unique_id'].to_dict())
        idf.columns = 'left_' + idf.columns.values
        matched_item_meta = idf.merge(filter_idf,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_item_meta

    def Re_Train(self,new_user_meta,new_item_meta,new_user_item_interactions,attr_list,df_users,df_items,df_interactions,Global_Obj):
        dataset = Dataset()
        dataset.fit(users=new_user_meta['userID'], ## new 
            items=new_item_meta['itemID'],
            item_features=attr_list,
            user_features=attr_list)

        item_features = dataset.build_item_features([(x,dict(zip(y,[*map(Global_Obj.attr_weights.get,y)]))) for x,y in zip(new_item_meta['itemID'],new_item_meta['item_attr_list'])], normalize=True)
        user_features = dataset.build_user_features([(x,dict(zip(y,[*map(Global_Obj.attr_weights.get,y)]))) for x,y in zip(new_user_meta['userID'],new_user_meta['user_attr_list'])], normalize=True)
        if "weight" in new_user_item_interactions.keys():
            (interactions, weights) = dataset.build_interactions((x, y, w) for x,y,w in zip(new_user_item_interactions['userID'],new_user_item_interactions['itemID'],new_user_item_interactions['weight']))
        else:
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
        df_interactions.to_csv(os.path.join(BASE_PATH, Read_DIR, "interaction_meta.csv"))
        
        self.__init__()  #### Re-Initialize the Model Variables
        return True
    
    def get_userid_of_profile(self,profile_df,current_user_id):
        df_profile_user = pd.merge(profile_df,self.user_meta,left_on="user_id",right_on="all_unique_id")
        return df_profile_user[df_profile_user['userId'] == current_user_id]['all_unique_id'].to_list()
    
    def check_profile_interaction(self,profile_id):
        return profile_id in self.interaction_meta['profileId'].to_list()

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
