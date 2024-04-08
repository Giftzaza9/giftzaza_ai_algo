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
from datetime import datetime
from aiocache import Cache
from aiocache.serializers import PickleSerializer
from copy import deepcopy
import numpy as numpy
from recommenders.utils.timer import Timer
from recommenders.models.lightfm.lightfm_utils import (
    similar_users,
    similar_items,
)
from sentence_transformers import SentenceTransformer

cache = Cache(Cache.REDIS, endpoint="redis", port=6379, namespace="main",serializer=PickleSerializer())

BASE_PATH = os.path.dirname(__file__)
Read_DIR = "lib"
Backup_DIR = "lib_backup"

class LightFM_cls:
    def __init__(self) -> None:
        self.model = None
        self.profile_features = None
        self.item_features = None
        self.dataset = None
        self.profile_mapper = self.profile_fmapper = self.item_mapper = self.item_fmapper = None
        self.rprofile_mapper = self.ritem_mapper = self.rprofile_fmapper = self.ritem_fmapper = None
        self.profile_meta = None
        self.item_meta = None
        self.interaction_meta = None
        self.updated_at = None
        self.text_encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        self.save_model_to_cache
    
    async def add_to_cache(self,var_name,var_ref) -> None:
        await cache.set(var_name,var_ref)

    async def clear_cache(self) -> None:
        await cache.clear(namespace="main")

    async def load_from_cache(self,var_name):
        exist_flag = await cache.exists(var_name)
        if exist_flag:
            return await cache.get(var_name)
        else:
            return None
        
    
    async def save_model_to_cache(self):
        print("Saving to Cache")
        await self.add_to_cache("model",self.model)
        await self.add_to_cache("profile_features",self.profile_features)
        await self.add_to_cache("item_features",self.item_features)
        await self.add_to_cache("dataset",self.dataset)
        await self.add_to_cache("profile_meta",self.profile_meta)
        await self.add_to_cache("item_meta",self.item_meta)
        await self.add_to_cache("interaction_meta",self.interaction_meta)

        await self.add_to_cache("updated_at",self.updated_at)
        return None
    
    async def load_model_from_cache(self):
        print("Loading From Cache")
        self.model = await self.load_from_cache("model")
        self.profile_features = await self.load_from_cache("profile_features")
        self.item_features = await self.load_from_cache("item_features")
        self.dataset = await self.load_from_cache("dataset")
        self.profile_mapper, self.profile_fmapper, self.item_mapper, self.item_fmapper = self.dataset.mapping()
        self.rprofile_mapper = dict([(v,k) for k,v in self.profile_mapper.items()])
        self.ritem_mapper = dict([(v,k) for k,v in self.item_mapper.items()])
        self.rprofile_fmapper = dict([(v,k) for k,v in self.profile_fmapper.items()])
        self.ritem_fmapper = dict([(v,k) for k,v in self.item_fmapper.items()])
        self.profile_meta = await self.load_from_cache("profile_meta")
        self.item_meta = await self.load_from_cache("item_meta")
        self.interaction_meta = await self.load_from_cache("interaction_meta")

        self.updated_at = await self.load_from_cache("updated_at")
        return None
    
    async def model_cache_loader(self):
        print("Loading :",os.getpid())
        updated_at_in_cache = await self.load_from_cache("updated_at")
        if updated_at_in_cache!=None:
            print(self.updated_at,updated_at_in_cache)
            if updated_at_in_cache > self.updated_at:
                await self.load_model_from_cache()
        else:
            await self.load_model_from_cache()
        return None
    
    async def model_cache_saver(self):
        print("Saving :",os.getpid())
        updated_at_in_cache = await self.load_from_cache("updated_at")
        if updated_at_in_cache!=None:
            print(self.updated_at,updated_at_in_cache)
            if (self.updated_at > updated_at_in_cache):
                await self.save_model_to_cache()
        else:
            await self.save_model_to_cache()
        return None

    def encode_textual_data(self, textual_data):
        """Encode textual data using the sentence transformer model."""
        return self.text_encoder.encode(textual_data, convert_to_tensor=True)
    
    def get_score(self,attr_list,profile_dataframe,Global_Obj,weighted=False):
        if weighted:
            profile_dataframe['score'] = profile_dataframe['tags'].apply(lambda eachList : sum([*map(Global_Obj.attr_weights.get,list(set(attr_list).intersection(set(eachList))))])/sum([*map(Global_Obj.attr_weights.get,list(set(attr_list+eachList)))]))
        else:
            profile_dataframe["score"] = profile_dataframe['tags'].apply(lambda eachList : len(set(attr_list).intersection(set(eachList)))/len(set(attr_list+eachList)))
        profile_dataframe.sort_values(by=['score'],ascending=False,inplace=True)
        profile_dataframe.reset_index(drop=True,inplace=True)
        return profile_dataframe

    def similar_existing_profile(self,original_profile_id,N=10):
        try:
            profile_id = self.profile_mapper[original_profile_id]
        except Exception as e:
            raise KeyError("Given Profile Id is not present in Model")
        Profile_df = similar_users(user_id=profile_id, 
              user_features=self.profile_features, 
              model=self.model,
              N=N)
        Profile_df['all_unique_id'] = Profile_df['userID'].map(self.rprofile_mapper)   ### "similar_users" function is from recommenders library which return id in column name "userID"
        Profile_df.columns = 'left_' + Profile_df.columns.values
        matched_profile_meta = Profile_df.merge(self.profile_meta,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_profile_meta
    
    def similar_existing_item(self,original_item_id,N=10):
        try:
            item_id = self.item_mapper[original_item_id]
        except Exception as e:
            raise KeyError("Given Item Id is not present in Model")
        item_df = similar_items(item_id=item_id, 
              item_features=self.item_features, 
              model=self.model,
              N=N)
        item_df['all_unique_id'] = item_df['itemID'].map(self.ritem_mapper)
        item_df.columns = 'left_' + item_df.columns.values
        matched_item_meta = item_df.merge(self.item_meta,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_item_meta
    
    def cold_start_similar_profile(self,filter_dict,hard_filter_attrs,soft_filter_attrs,all_profile_attribute_list,Global_Obj,N=10,explicit_filters=None):
        filter_Profile_df = self.profile_meta[self.profile_meta['tags'].apply(lambda eachList : set(hard_filter_attrs).issubset(set(eachList)))].copy()
        filter_Profile_df.reset_index(drop=True,inplace=True)
        for each_semi_hard_filter in explicit_filters["semi_hard_filters"] if explicit_filters else Global_Obj.category_filters["semi_hard_filters"]:
            filter_Profile_df = filter_Profile_df[filter_Profile_df['tags'].apply(lambda eachList : bool(set(filter_dict[each_semi_hard_filter]).intersection(eachList)))]
            filter_Profile_df.reset_index(drop=True,inplace=True)
        filter_Profile_df.reset_index(drop=True,inplace=True)
        feat_idxs = [self.profile_fmapper.get(key) for key in soft_filter_attrs]
        u_biases, user_representations = self.model.get_user_representations(features=self.profile_features)

        if filter_Profile_df.shape[0] == 0:
            return pd.DataFrame(columns=['left_all_unique_id','left_score'])

        # summation = 0
        # for idx in range(len(feat_idxs)):
        #     summation += (self.model.user_embeddings[feat_idxs[idx]] )
        # filter_user_embeddings = []
        # for idx in filter_Profile_df['all_unique_id'].tolist():
        #     filter_user_embeddings.append(user_representations[self.profile_fmapper[idx]])
        # filter_user_embeddings = np.array(filter_user_embeddings)
        # scores = filter_user_embeddings.dot(summation)
        # user_norms = np.linalg.norm(filter_user_embeddings, axis=1)
        # user_vec_norm = np.linalg.norm(summation)
        # scores = np.squeeze(scores / user_norms / user_vec_norm)
        # scores = scores.reshape(-1)
        # best = np.argsort(-scores)[0 : N]
        # Profile_df = sorted(zip(best, scores[best]), key=lambda x: -x[1])
        # Profile_df = pd.DataFrame(Profile_df,columns=['userID','score'])
        # Profile_df['all_unique_id'] = Profile_df['userID'].map(filter_Profile_df['all_unique_id'].to_dict())
        # Profile_df.columns = 'left_' + Profile_df.columns.values
        # matched_profile_meta = Profile_df.merge(filter_Profile_df,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        
        matched_profile_meta = self.get_score(all_profile_attribute_list,filter_Profile_df.copy(),Global_Obj=Global_Obj,weighted=True)
        matched_profile_meta.columns = 'left_' + matched_profile_meta.columns.values

        return matched_profile_meta
    
    def cold_start_similar_items(self,filter_dict,hard_filter_attrs,soft_filter_attrs,Global_Obj,N=10,min_budget=0,max_budget=None,test_sample_flag=False,explicit_filters=None):
        filter_item_df = self.item_meta[self.item_meta['tags'].apply(lambda eachList : set(hard_filter_attrs).issubset(set(eachList)))].copy()
        filter_item_df.reset_index(drop=True,inplace=True)
        for each_semi_hard_filter in explicit_filters["semi_hard_filters"] if explicit_filters else Global_Obj.category_filters["semi_hard_filters"]:
            filter_item_df = filter_item_df[filter_item_df['tags'].apply(lambda eachList : bool(set(filter_dict[each_semi_hard_filter]).intersection(eachList)))]
            filter_item_df.reset_index(drop=True,inplace=True)
        filter_item_df = filter_item_df.astype({"price" : "float"})
        def_budget_filter = lambda price : (price>=min_budget) & (price<=max_budget) if max_budget else price>=min_budget
        filter_item_df = filter_item_df[filter_item_df['price'].apply(def_budget_filter)]
        filter_item_df.reset_index(drop=True,inplace=True)
        all_soft_attrs = list(itertools.chain(*map(Global_Obj.cat_dict.get,Global_Obj.category_filters["soft_filters"])))
        # filter_item_df['matched_tags'] = filter_item_df['tags'].apply(lambda eachList: list(set(eachList) & set(soft_filter_attrs)))
        filter_item_df['matched_tags'] = filter_item_df['tags'].apply(lambda eachList: list(set(eachList) & set(all_soft_attrs)))
        filter_item_df['embedding_tags'] = filter_item_df['matched_tags'].apply(lambda eachList : [*map(dict(enumerate(self.model.item_embeddings)).get,[*map(self.item_fmapper.get, eachList)])] )
        filter_item_df['embedding_tags'] = filter_item_df['embedding_tags'].apply(sum)
        if test_sample_flag:
            filter_item_df = filter_item_df[filter_item_df['test_set']==True].copy()
        filter_item_df.reset_index(drop=True,inplace=True)
        feat_idxs = [self.item_fmapper.get(key) for key in soft_filter_attrs]
        if filter_item_df.shape[0] == 0:
            return pd.DataFrame(columns=['left_all_unique_id','title','tags','left_score'])

        summation = 0
        for idx in range(len(feat_idxs)):
            summation += (self.model.item_embeddings[feat_idxs[idx]] ) ### Without Factrorizing with the weights
        
        filter_item_embeddings = np.array(filter_item_df['embedding_tags'].to_list())
        scores = filter_item_embeddings.dot(summation)
        item_norms = np.linalg.norm(filter_item_embeddings, axis=1)
        item_vec_norm = np.linalg.norm(summation)
        scores = np.squeeze(scores / item_norms / item_vec_norm)
        scores = scores.reshape(-1)
        best = np.argsort(-scores)[0 : N]
        item_df = sorted(zip(best, scores[best]), key=lambda x: -x[1])
        item_df = pd.DataFrame(item_df,columns=['itemID','score'])
        item_df['all_unique_id'] = item_df['itemID'].map(filter_item_df['all_unique_id'].to_dict())
        item_df.columns = 'left_' + item_df.columns.values
        matched_item_meta = item_df.merge(filter_item_df,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_item_meta
    
    def profile_item_recommendation(self,original_profile_id):
        try:
            user_id = self.profile_mapper[original_profile_id]
        except Exception as e:
            raise KeyError("Given User Id is not present in Model")
        list_item_ids = list(self.item_mapper.values())
        scores = self.model.predict(user_id,list_item_ids)
        score_mapper = pd.DataFrame(list(zip(list_item_ids,scores)),columns = ["item_mapping_id","matching_score"])
        score_mapper["matched_item_id"] = score_mapper['item_mapping_id'].map(self.ritem_mapper)
        top_items = score_mapper.merge(self.item_meta,left_on=['matched_item_id'],right_on=['all_unique_id'],copy=True)
        top_items.sort_values(by=["matching_score"],ascending=False,inplace=True)
        top_items.reset_index(drop=True,inplace=True)
        return top_items
    
    def cold_start_profile_item_recommendation(self,filter_dict,hard_filter_attrs,new_profile_attributes,similar_profile_id,Global_Obj,min_budget=0,max_budget=None,test_sample_flag=False,explicit_filters=None):
        filter_item_df = self.item_meta[self.item_meta['tags'].apply(lambda eachList : set(hard_filter_attrs).issubset(set(eachList)))].copy()
        filter_item_df.reset_index(drop=True,inplace=True)
        for each_semi_hard_filter in explicit_filters["semi_hard_filters"] if explicit_filters else Global_Obj.category_filters["semi_hard_filters"]:
            filter_item_df = filter_item_df[filter_item_df['tags'].apply(lambda eachList : bool(set(filter_dict[each_semi_hard_filter]).intersection(eachList)))]
            filter_item_df.reset_index(drop=True,inplace=True)
        if test_sample_flag:
            filter_item_df = filter_item_df[filter_item_df['test_set']==True].copy()
        new_profile_features = self.dataset.build_user_features([(similar_profile_id,new_profile_attributes)])
        list_item_ids = filter_item_df['all_unique_id'].map(self.item_mapper).to_list()
        if len(list_item_ids)!=0:
            scores_new_profile = self.model.predict(user_ids = self.profile_mapper[similar_profile_id],item_ids = list_item_ids, user_features=new_profile_features)
            score_mapper = pd.DataFrame(list(zip(list_item_ids,scores_new_profile)),columns = ["item_mapping_id","matching_score"])
            score_mapper["matched_item_id"] = score_mapper['item_mapping_id'].map(self.ritem_mapper)
            top_items_new = score_mapper.merge(filter_item_df,left_on=['matched_item_id'],right_on=['all_unique_id'],copy=True)
            top_items_new.sort_values(by=["matching_score"],ascending=False,inplace=True)
            top_items_new.reset_index(drop=True,inplace=True)
            def_budget_filter = lambda price : (price>=min_budget) & (price<=max_budget) if max_budget else price>=min_budget
            top_items_new = top_items_new[top_items_new['price'].apply(def_budget_filter)]
            top_items_new.reset_index(drop=True,inplace=True)
        else:
            return pd.DataFrame(columns = ['all_unique_id','title','tags','matching_score'])
        return top_items_new
    
    
    def cold_start_similar_items_with_text_sim(self,filter_dict,hard_filter_attrs,soft_filter_attrs,Global_Obj,N=10,content_attr=None,min_budget=0,max_budget=None,test_sample_flag=False,explicit_filters=None):
        filter_item_df = self.item_meta[self.item_meta['tags'].apply(lambda eachList : set(hard_filter_attrs).issubset(set(eachList)))].copy()
        filter_item_df.reset_index(drop=True,inplace=True)
        for each_semi_hard_filter in explicit_filters["semi_hard_filters"] if explicit_filters else Global_Obj.category_filters["semi_hard_filters"]:
            filter_item_df = filter_item_df[filter_item_df['tags'].apply(lambda eachList : bool(set(filter_dict[each_semi_hard_filter]).intersection(eachList)))]
            filter_item_df.reset_index(drop=True,inplace=True)
        filter_item_df = filter_item_df.astype({"price" : "float"})
        def_budget_filter = lambda price : (price>=min_budget) & (price<=max_budget) if max_budget else price>=min_budget
        filter_item_df = filter_item_df[filter_item_df['price'].apply(def_budget_filter)]
        filter_item_df.reset_index(drop=True,inplace=True)
        all_soft_attrs = list(itertools.chain(*map(Global_Obj.cat_dict.get,Global_Obj.category_filters["soft_filters"])))
        # filter_item_df['matched_tags'] = filter_item_df['tags'].apply(lambda eachList: list(set(eachList) & set(soft_filter_attrs)))
        filter_item_df['matched_tags'] = filter_item_df['tags'].apply(lambda eachList: list(set(eachList) & set(all_soft_attrs)))
        filter_item_df['embedding_tags'] = filter_item_df['matched_tags'].apply(lambda eachList : [*map(dict(enumerate(self.model.item_embeddings)).get,[*map(self.item_fmapper.get, eachList)])] )
        filter_item_df['embedding_tags'] = filter_item_df['embedding_tags'].apply(sum)
        filter_item_df.reset_index(drop=True,inplace=True)
        if test_sample_flag:
            filter_item_df = filter_item_df[filter_item_df['test_set']==True].copy()
            filter_item_df.reset_index(drop=True,inplace=True)
        feat_idxs = [self.item_fmapper.get(key) for key in soft_filter_attrs]
        i_biases, item_representations = self.model.get_item_representations(features=self.item_features)
        if filter_item_df.shape[0] == 0:
            return pd.DataFrame(columns = ['left_all_unique_id','title','tags','left_score'])
        
        # soft_filter_dict = {}
        # weight_assigner = {}
        # total = 0
        # for i in Global_Obj.category_filters["soft_filters"]:
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
        filter_item_embeddings = np.array(filter_item_df['embedding_tags'].to_list())
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
            for desc in filter_item_df.description
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
        item_df = sorted(zip(best, scores[best]), key=lambda x: -x[1])
        item_df = pd.DataFrame(item_df,columns=['itemID','score'])
        item_df['all_unique_id'] = item_df['itemID'].map(filter_item_df['all_unique_id'].to_dict())
        item_df.columns = 'left_' + item_df.columns.values
        matched_item_meta = item_df.merge(filter_item_df,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_item_meta

    def Re_Train(self,new_profile_meta,new_item_meta,new_profile_item_interactions,attr_list,df_users,df_items,df_interactions,Global_Obj):
        print(os.getpid())
        dataset = Dataset()
        dataset.fit(users=new_profile_meta['profileID'], ## new 
            items=new_item_meta['itemID'],
            item_features=attr_list,
            user_features=attr_list)

        item_features = dataset.build_item_features([(x,dict(zip(y,[*map(Global_Obj.attr_weights.get,y)]))) for x,y in zip(new_item_meta['itemID'],new_item_meta['item_attr_list'])], normalize=True)
        user_features = dataset.build_user_features([(x,dict(zip(y,[*map(Global_Obj.attr_weights.get,y)]))) for x,y in zip(new_profile_meta['profileID'],new_profile_meta['profile_attr_list'])], normalize=True)
        if "weight" in new_profile_item_interactions.keys():
            (interactions, weights) = dataset.build_interactions((x, y, w) for x,y,w in zip(new_profile_item_interactions['profileID'],new_profile_item_interactions['itemID'],new_profile_item_interactions['weight']))
        else:
            (interactions, weights) = dataset.build_interactions((x, y) for x,y in zip(new_profile_item_interactions['profileID'],new_profile_item_interactions['itemID']))
        n_components = 30
        loss = 'warp'
        epoch = 30
        num_thread = 4
        with Timer() as Train_timer:
            model = LightFM(no_components= n_components, loss=loss, random_state = 1616)
            model.fit(interactions,  user_features= user_features, item_features= item_features, epochs=epoch,num_threads = num_thread, sample_weight = weights)

        # shutil.copytree(os.path.join(BASE_PATH, Read_DIR),os.path.join(BASE_PATH, Backup_DIR,"Backup-"+str(datetime.datetime.now())))

        # with open(os.path.join(BASE_PATH, Read_DIR, 'model.pkl'), 'wb') as fle:
        #     pickle.dump(model, fle, protocol=pickle.HIGHEST_PROTOCOL)
        # with open(os.path.join(BASE_PATH, Read_DIR, 'user_features.pkl'), 'wb') as fle:
        #     pickle.dump(user_features, fle, protocol=pickle.HIGHEST_PROTOCOL)
        # with open(os.path.join(BASE_PATH, Read_DIR, 'item_features.pkl'), 'wb') as fle:
        #     pickle.dump(item_features, fle, protocol=pickle.HIGHEST_PROTOCOL)
        # with open(os.path.join(BASE_PATH, Read_DIR, 'dataset_builder.pkl'), 'wb') as fle:
        #     pickle.dump(dataset, fle, protocol=pickle.HIGHEST_PROTOCOL)

        # df_users.to_csv(os.path.join(BASE_PATH, Read_DIR, "user_meta.csv"))
        # df_items.to_csv(os.path.join(BASE_PATH, Read_DIR, "item_meta.csv"))
        # df_interactions.to_csv(os.path.join(BASE_PATH, Read_DIR, "interaction_meta.csv"))

        #### Re-Initialize the Model Variables
        self.model = deepcopy(model)
        self.profile_features = deepcopy(user_features)
        self.item_features = deepcopy(item_features)
        self.dataset = deepcopy(dataset)
        self.profile_mapper, self.profile_fmapper, self.item_mapper, self.item_fmapper = self.dataset.mapping()
        self.rprofile_mapper = dict([(v,k) for k,v in self.profile_mapper.items()])
        self.ritem_mapper = dict([(v,k) for k,v in self.item_mapper.items()])
        self.rprofile_fmapper = dict([(v,k) for k,v in self.profile_fmapper.items()])
        self.ritem_fmapper = dict([(v,k) for k,v in self.item_fmapper.items()])
        self.profile_meta = df_users.copy()
        self.item_meta = df_items.copy()
        self.interaction_meta = df_interactions.copy()
        self.profile_meta['tags'] = self.profile_meta['tags'].apply(lambda eachList : list(map(lambda x: x.strip().lower(),eachList)))
        self.item_meta['tags'] = self.item_meta['tags'].apply(lambda eachList : list(map(lambda x: x.strip().lower(),eachList)))
        self.updated_at = datetime.now()
        print(f"Took {Train_timer.interval:.1f} seconds for Training the Model.")

        return True
    
    def get_userid_of_profile(self,profile_df,current_user_id):
        df_profile_user = pd.merge(profile_df,self.profile_meta,left_on="user_id",right_on="all_unique_id")
        return df_profile_user[df_profile_user['userId'] == current_user_id]['all_unique_id'].to_list()
    
    def check_profile_interaction(self,profile_id):
        return profile_id in self.interaction_meta['profileId'].to_list()

    def Example_Train(self,new_profile_meta,new_item_meta,new_profile_item_interactions,attr_list):
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
