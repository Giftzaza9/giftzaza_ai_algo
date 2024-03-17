import os
import sys
import ast
from pathlib import Path
from src.lightfm_model.model import LightFM_cls
from src.mongodb.mongodb import Mongodb_cls
import json
import itertools
import pandas as pd
import numpy as np

BASE_PATH = os.path.dirname(__file__) 

class Global_cls:
    def __init__(self) -> None:
        with open(os.path.join(Path(BASE_PATH).parent.absolute(), "lib", "category.json"),'r') as fr:
            self.cat_odata = json.load(fr)
            self.cat_odata.pop("gpt_assistance")
            self.attr_list= []
            self.attr_weights = {}
            self.hard_filters=["gender","age_category"]
            self.semi_hard_filters = ["interest"]
            self.soft_filters=["occasion","relationship","style"]
            self.preprocess_str = lambda x: x.strip().lower()
            self.cat_dict = {}
            for i in self.cat_odata:
                if self.cat_odata[i].get('keyword_search',None):
                    keys=list(map(self.preprocess_str,list(self.cat_odata[i]['category'].keys())))
                    self.cat_dict[i] = keys
                else:
                    keys=list(map(self.preprocess_str,self.cat_odata[i]['category']))
                    self.cat_dict[i] = keys
                if i not in self.hard_filters and i not in self.semi_hard_filters: ### Hard Filters removed from the model parameters
                    self.attr_list.extend(keys)
                self.attr_weights.update(dict(zip(keys,[self.cat_odata[i].get("manual_weights",1) for _ in range(len(keys))])))
        with open(os.path.join(Path(BASE_PATH).parent.absolute(), "lib", "useractivity.json"),'r') as fr:
            self.user_activity_types = json.load(fr)

LightFM_Obj = LightFM_cls()
Mongodb_Obj = Mongodb_cls()
Global_Obj = Global_cls()          

def filter_attributes(Global_Obj,new_attributes_list):
    filter_dict = {}
    hard_filter_attrs = []
    semi_hard_filter_attrs=[]
    for i in Global_Obj.hard_filters:
        common_list = list(set(Global_Obj.cat_dict[i]) & set(new_attributes_list))
        hard_filter_attrs.extend(common_list)
        filter_dict.update({i: common_list})

    for i in Global_Obj.semi_hard_filters:
        common_list = list(set(Global_Obj.cat_dict[i]) & set(new_attributes_list))
        semi_hard_filter_attrs.extend(common_list)
        filter_dict.update({i: common_list})

    soft_filter_attrs = list(set(new_attributes_list).difference(set(hard_filter_attrs+semi_hard_filter_attrs)))

    return filter_dict,hard_filter_attrs,soft_filter_attrs,semi_hard_filter_attrs


def similar_users_endpoint(user_id,N=10):
    udf = LightFM_Obj.similar_existing_user(user_id,N)[['left_all_unique_id','left_score']].copy()
    udf.rename(columns={'left_all_unique_id':'user_id','left_score':'matching_score'},inplace=True)
    return udf.to_dict(orient='records')

def similar_items_endpoint(item_id,N=10):
    idf = LightFM_Obj.similar_existing_item(item_id,N)[['left_all_unique_id','title','tags','left_score']].copy()
    idf.rename(columns={'left_all_unique_id':'item_id','left_score':'matching_score'},inplace=True)
    return idf.to_dict(orient='records')

def cs_similar_user(new_user_attributes,N=10):
    
    filter_dict,hard_filter_attrs,soft_filter_attrs,semi_hard_filter_attrs = filter_attributes(Global_Obj=Global_Obj,new_attributes_list=new_user_attributes)

    udf = LightFM_Obj.cold_start_similar_user(filter_dict,hard_filter_attrs=hard_filter_attrs,soft_filter_attrs=soft_filter_attrs,Global_Obj=Global_Obj,N=N)
    udf = udf[['left_all_unique_id','left_score']].copy()
    udf.rename(columns={'left_all_unique_id':'user_id','left_score':'matching_score'},inplace=True)
    
    return udf.to_dict(orient='records')

def cs_similar_items(new_item_attributes,N=10,min_budget=0,max_budget=None,test_sample_flag=False):

    filter_dict,hard_filter_attrs,soft_filter_attrs,semi_hard_filter_attrs = filter_attributes(Global_Obj=Global_Obj,new_attributes_list=new_item_attributes)

    idf = LightFM_Obj.new_cold_start_similar_items(filter_dict,hard_filter_attrs=hard_filter_attrs,soft_filter_attrs=soft_filter_attrs,Global_Obj=Global_Obj,N=N,min_budget=min_budget,max_budget=max_budget,test_sample_flag=test_sample_flag)
    idf = idf[['left_all_unique_id','title','tags','left_score']].copy()
    idf.rename(columns={'left_all_unique_id':'item_id','left_score':'matching_score'},inplace=True)
    
    return idf.to_dict(orient='records')

def user_item_recommendation(user_id,N=10):
    idf = LightFM_Obj.user_item_recommendation(user_id)[['all_unique_id','title','matching_score']]
    return idf.head(N).to_dict(orient='records')

def cs_user_item_recommendation(new_user_attributes,similar_user_id,N=10,min_budget=0,max_budget=None,test_sample_flag=False):
    
    filter_dict,hard_filter_attrs,soft_filter_attrs,semi_hard_filter_attrs = filter_attributes(Global_Obj=Global_Obj,new_attributes_list=new_user_attributes)

    idf = LightFM_Obj.cold_start_user_item_recommendation(new_user_attributes,similar_user_id,min_budget=min_budget,max_budget=max_budget)[['all_unique_id','title','tags','matching_score']]
    if test_sample_flag:
        idf = idf[idf['test_set']==True].copy()

    idf = idf[idf['tags'].apply(lambda eachList : set(hard_filter_attrs).issubset(set(eachList)))]
    for each_semi_hard_filter in Global_Obj.semi_hard_filters:
            idf = idf[idf['tags'].apply(lambda eachList : bool(set(filter_dict[each_semi_hard_filter]).intersection(eachList)))]
    return idf.head(N).to_dict(orient='records')
    # return idf.to_dict(orient='records')

def cs_similar_items_with_text_sim(new_item_attributes,content_attr=None,N=10,min_budget=0,max_budget=None,test_sample_flag=False):

    filter_dict,hard_filter_attrs,soft_filter_attrs,semi_hard_filter_attrs = filter_attributes(Global_Obj=Global_Obj,new_attributes_list=new_item_attributes)

    idf = LightFM_Obj.new_cold_start_similar_items_with_text_sim(filter_dict,hard_filter_attrs=hard_filter_attrs,soft_filter_attrs=soft_filter_attrs,Global_Obj=Global_Obj,N=N,content_attr=content_attr,min_budget=min_budget,max_budget=max_budget,test_sample_flag=test_sample_flag)
    idf = idf[['left_all_unique_id','title','tags','left_score']].copy()
    idf.rename(columns={'left_all_unique_id':'item_id','left_score':'matching_score'},inplace=True)
    
    return idf.to_dict(orient='records')

def train_with_mongodb(hil_flag = False,is_active_flag=True,weight_flag=True):
    try:
        try:
            Mongodb_Obj.connect()
                
            df_items = Mongodb_Obj.get_collection_as_dataframe("test","products")
            filter_condition = True
            if is_active_flag:
                filter_condition = (filter_condition) & (df_items["is_active"]==is_active_flag)
            if hil_flag:
                filter_condition = (filter_condition) & (df_items['hil']==hil_flag)
            df_items = df_items[filter_condition]

            df_users = Mongodb_Obj.get_collection_as_dataframe("test","profiles")
            df_users.rename({"preferences":"tags",
                             "user_id":"userId"},inplace=True, axis=1)
            
            df_interactions = Mongodb_Obj.get_collection_as_dataframe("test","useractivities")
            df_interactions.dropna(inplace=True)
            df_interactions.rename({"product_id":"productId",
                                    "user_id":"userId",
                                    "profile_id":"profileId",
                                    "activity":"activity_type"},inplace=True, axis=1)
            df_interactions = df_interactions[df_interactions['activity_type']!="dislike"]
        except Exception as e:
            raise Exception(f"Error in Connection to Mongodb : {e}")
        
        if weight_flag:
            df_interactions['weight'] = df_interactions['activity_type'].map(Global_Obj.user_activity_types)
            rdf_interactions = df_interactions[['profileId','productId','activity_type','weight']].copy()
            rdf_interactions = rdf_interactions.astype({'profileId': 'str',
                                                        'productId': 'str',
                                                        'activity_type': 'str'
                                                        })
        else:
            rdf_interactions = df_interactions[['profileId','productId']].copy()

        rdf_items = df_items[['_id','tags']].copy()
        rdf_items['_id'] = rdf_items['_id'].astype(str)
        rdf_items['tags'] = rdf_items['tags'].apply(lambda eachList : list(map(lambda x: x.strip().lower(), eachList)) )
        rdf_items['tags'] = rdf_items['tags'].apply(lambda eachList : list(set(eachList) & set(Global_Obj.attr_list)))

        rdf_users = df_users[['_id','tags']].copy()
        rdf_users['_id'] = rdf_users['_id'].astype(str)
        rdf_users['tags'] = rdf_users['tags'].apply(lambda eachList : list(map(lambda x: x.strip().lower(), eachList)) )
        rdf_users['tags'] = rdf_users['tags'].apply(lambda eachList : list(set(eachList) & set(Global_Obj.attr_list)))

        df_users['all_unique_id'] = df_users['_id'].astype(str).copy()
        df_items['all_unique_id'] = df_items['_id'].astype(str).copy()

        rdf_users.rename(columns={"_id":"userID","tags":"user_attr_list"},inplace=True)
        rdf_items.rename(columns={"_id":"itemID","tags":"item_attr_list"},inplace=True)
        rdf_interactions.rename(columns={"profileId":"userID","productId":"itemID"},inplace=True)

        rdf_interactions = rdf_interactions[rdf_interactions['userID'].isin(set(rdf_users['userID']))]
        rdf_interactions = rdf_interactions[rdf_interactions['itemID'].isin(set(rdf_items['itemID']))]

        LightFM_Obj.Re_Train(rdf_users.to_dict(orient='list'),
                rdf_items.to_dict(orient='list'),
                rdf_interactions.to_dict(orient='list'),
                Global_Obj.attr_list,
                df_users,
                df_items,
                df_interactions,
                Global_Obj
                )
    except Exception as e:
        return {"status":False,
                "message" : f"Error in re-train :{e}"}
        
    return {"status":True,
            "message": "model re-train succesful and loaded with new weights"}

def test_with_sample(N):
    ts_df = pd.read_csv(os.path.join(Path(BASE_PATH).parent.absolute(), "lib", "Giftzaza_Test Case.csv"))
    ts_df['Profile tags'] = ts_df['Profile tags'].apply(lambda eachList : ast.literal_eval(eachList))
    ts_df['TOP 4 products (actual)'] = ts_df['TOP 4 products (actual)'].apply(lambda eachList : ast.literal_eval(eachList))
    # ts_df['result'] = ts_df['Profile tags'].apply(lambda each_attr : list(map(lambda eachResult : eachResult['item_id'],cs_similar_items(each_attr,N=N))))
    ts_df['result'] = ts_df['Profile tags'].apply(lambda each_attr : list(map(lambda eachResult : eachResult['item_id'],create_recommendation("new_user0",each_attr,content_attr=None,N=N,test_sample_flag=False))))
    ts_df['matched_result'] = ts_df.apply(lambda row: set(row['TOP 4 products (actual)']).intersection(set(row['result'])) ,axis =1)
    ts_df['precision_at_k'] = ts_df.apply(lambda row: len(row['matched_result'])/N,axis =1)
    ts_df['recall_at_k'] = ts_df.apply(lambda row: len(row['matched_result'])/len(row['TOP 4 products (actual)']),axis =1)
    print(f"Precision_at_{N} :",ts_df['precision_at_k'].agg("mean"))
    print(f"recall_at_{N} :",ts_df['recall_at_k'].agg("mean"))
    return {f"Precision_at_{N}":ts_df['precision_at_k'].agg("mean"),
            f"recall_at_{N}":ts_df['recall_at_k'].agg("mean")}


def create_recommendation(user_id,new_attributes,content_attr=None,N=20,min_budget=0,max_budget=None,test_sample_flag=False):
    df_similar_profile = pd.DataFrame(cs_similar_user(new_attributes,N=10))
    similar_profile_cutoff = df_similar_profile[df_similar_profile['matching_score']>0.7][:5]
    if similar_profile_cutoff.shape[0] > 0: ### No similar Profile
        profile_user_id = LightFM_Obj.get_userid_of_profile(similar_profile_cutoff,user_id) ### similar profile from same user
        if profile_user_id:
            for profile_id in profile_user_id:
                if LightFM_Obj.check_profile_interaction(profile_id=profile_id):
                    return cs_user_item_recommendation(new_user_attributes=new_attributes,similar_user_id=profile_user_id,N=N,min_budget=min_budget,max_budget=max_budget,test_sample_flag = test_sample_flag)
        ####  If No Similar profile from same user - Popular recommendation from all profile
        popular_recommdendations = []
        for profile_id in similar_profile_cutoff['user_id'].to_list():
            try:
                if LightFM_Obj.check_profile_interaction(profile_id=profile_id):
                    popular_recommdendations.extend(cs_user_item_recommendation(new_user_attributes=new_attributes,similar_user_id=profile_id,N=N,min_budget=min_budget,max_budget=max_budget,test_sample_flag = test_sample_flag))
            except Exception as e:
                raise Exception(f"Error in Getting Similar Profile recommdendation : {e}")
        if popular_recommdendations:
            popular_recommdendations = pd.DataFrame(popular_recommdendations).sort_values(by='matching_score',ascending=False).to_dict(orient='records')
            return popular_recommdendations[:N]
    #### if No interaction for any of the profiles
    if content_attr:
        return cs_similar_items_with_text_sim(new_item_attributes=new_attributes,content_attr=content_attr,N=N,min_budget=min_budget,max_budget=max_budget,test_sample_flag=test_sample_flag)
    return cs_similar_items(new_item_attributes=new_attributes,N=N,min_budget=min_budget,max_budget=max_budget,test_sample_flag=test_sample_flag)


