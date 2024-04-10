import os
import sys
import ast
from pathlib import Path
from settings import env
from src.lightfm_model.model import LightFM_cls
from src.mongodb.mongodb import Mongodb_cls
from sklearn.preprocessing import MinMaxScaler
import json
import itertools
import time
import pandas as pd
import asyncio
import numpy as np

BASE_PATH = os.path.dirname(__file__) 

class Global_cls:
    def __init__(self) -> None:
        with open(os.path.join(Path(BASE_PATH).parent.absolute(), "lib", "category.json"),'r') as fr:
            self.cat_odata = json.load(fr)
            self.cat_odata.pop("gpt_assistance")
            if "budget" in self.cat_odata.keys():
                self.cat_odata.pop("budget")
            self.attr_list= []
            self.attr_weights = {}
            self.category_filters = {}
            self.category_filters["hard_filters"]=["gender","age_category"]
            self.category_filters["semi_hard_filters"] = ["interest"]
            self.category_filters["soft_filters"]=["occasion","relationship","style"]
            self.preprocess_str = lambda x: x.strip().lower()
            self.cat_dict = {}
            for i in self.cat_odata:
                if self.cat_odata[i].get('keyword_search',None):
                    keys=list(map(self.preprocess_str,list(self.cat_odata[i]['category'].keys())))
                    self.cat_dict[i] = keys
                else:
                    keys=list(map(self.preprocess_str,self.cat_odata[i]['category']))
                    self.cat_dict[i] = keys
                # if i not in self.category_filters["hard_filters"] and i not in self.category_filters["semi_hard_filters"]: ### Hard Filters removed from the model parameters
                #     self.attr_list.extend(keys)
                self.attr_list.extend(keys)
                self.attr_weights.update(dict(zip(keys,[self.cat_odata[i].get("manual_weights",1) for _ in range(len(keys))])))
        with open(os.path.join(Path(BASE_PATH).parent.absolute(), "lib", "useractivity.json"),'r') as fr:
            self.user_activity_types = json.load(fr)          

def filter_attributes(hard_filters,soft_filters,semi_hard_filters,new_attributes_list):
    filter_dict = {}
    hard_filter_attrs = []
    semi_hard_filter_attrs=[]
    for i in hard_filters:
        common_list = list(set(Global_Obj.cat_dict[i]) & set(new_attributes_list))
        hard_filter_attrs.extend(common_list)
        filter_dict.update({i: common_list})

    for i in semi_hard_filters:
        common_list = list(set(Global_Obj.cat_dict[i]) & set(new_attributes_list))
        semi_hard_filter_attrs.extend(common_list)
        filter_dict.update({i: common_list})

    soft_filter_attrs = list(set(new_attributes_list).difference(set(hard_filter_attrs+semi_hard_filter_attrs)))

    return filter_dict,hard_filter_attrs,soft_filter_attrs,semi_hard_filter_attrs


def similar_profiles_endpoint(profile_id,N=10):
    """
    similar profiles (given profile id should be present in the model)
    generate list of similar profiles for given profile_id from the exisiting profiles in the model.
    """
    profile_df = LightFM_Obj.similar_existing_profile(profile_id,N)[['left_all_unique_id','left_score']].copy()
    profile_df.rename(columns={'left_all_unique_id':'profile_id','left_score':'matching_score'},inplace=True)
    return profile_df.to_dict(orient='records')

def similar_items_endpoint(item_id,N=10):
    """
    similar items (given item id should be present in the model)
    generate list of similar items for given item_id from the exisiting items in the model .
    """
    item_df = LightFM_Obj.similar_existing_item(item_id,N)[['left_all_unique_id','title','tags','left_score']].copy()
    item_df.rename(columns={'left_all_unique_id':'item_id','left_score':'matching_score'},inplace=True)
    return item_df.to_dict(orient='records')

def cs_similar_profile(new_profile_attributes,N=10,explicit_filters=None):
    """
    Cold-Start similar profile
    generate list of similar profiles that are relevant to given profile attributes.
    """
    if explicit_filters:
        filter_dict,hard_filter_attrs,soft_filter_attrs,semi_hard_filter_attrs = filter_attributes(**explicit_filters,new_attributes_list=new_profile_attributes)
    else:
        filter_dict,hard_filter_attrs,soft_filter_attrs,semi_hard_filter_attrs = filter_attributes(**Global_Obj.category_filters,new_attributes_list=new_profile_attributes)

    profile_df = LightFM_Obj.cold_start_similar_profile(filter_dict,hard_filter_attrs=hard_filter_attrs,soft_filter_attrs=soft_filter_attrs,all_profile_attribute_list=new_profile_attributes,Global_Obj=Global_Obj,N=N,explicit_filters=explicit_filters)
    profile_df = profile_df[['left_all_unique_id','left_score']].copy()
    profile_df.rename(columns={'left_all_unique_id':'user_id','left_score':'matching_score'},inplace=True)
    profile_df.reset_index(drop=True,inplace=True)

    if profile_df['matching_score'].max()>1 or profile_df['matching_score'].min()<0:
        scaler = MinMaxScaler(feature_range=(0.1,0.90))
        profile_df['matching_score'] = pd.Series(scaler.fit_transform(profile_df['matching_score'].to_numpy().reshape(-1, 1)).reshape(-1))
    
    return profile_df.to_dict(orient='records')

def cs_similar_items(new_item_attributes,N=10,min_budget=0,max_budget=None,test_sample_flag=False,explicit_filters=None):
    """
    Cold-Start similar items
    generate list of similar items that are relevant to given item attributes
    """
    if explicit_filters:
        filter_dict,hard_filter_attrs,soft_filter_attrs,semi_hard_filter_attrs = filter_attributes(**explicit_filters,new_attributes_list=new_item_attributes)
    else:
        filter_dict,hard_filter_attrs,soft_filter_attrs,semi_hard_filter_attrs = filter_attributes(**Global_Obj.category_filters,new_attributes_list=new_item_attributes)

    item_df = LightFM_Obj.cold_start_similar_items(filter_dict,hard_filter_attrs=hard_filter_attrs,soft_filter_attrs=soft_filter_attrs,Global_Obj=Global_Obj,N=N,min_budget=min_budget,max_budget=max_budget,test_sample_flag=test_sample_flag,explicit_filters=explicit_filters)
    if item_df.shape[0]==0:
        return []
    item_df = item_df[['left_all_unique_id','title','tags','left_score']].copy()
    item_df.rename(columns={'left_all_unique_id':'item_id','left_score':'matching_score'},inplace=True)
    item_df.reset_index(drop=True,inplace=True)
    if item_df['matching_score'].max()>1 or item_df['matching_score'].min()<0:
        scaler = MinMaxScaler(feature_range=(0.1,0.90))
        item_df['matching_score'] = pd.Series(scaler.fit_transform(item_df['matching_score'].to_numpy().reshape(-1, 1)).reshape(-1))
    
    return item_df.to_dict(orient='records')

def profile_item_recommendation(profile_id,N=10):
    """
    Profile-Item recommendation (uses Interaction between profile-item and attributes of profile and item)
    (given profile id should be present in the model)
    generate list of item recommendation for the given existing profile id.
    """
    item_df = LightFM_Obj.profile_item_recommendation(profile_id)[['all_unique_id','title','matching_score']]
    if item_df['matching_score'].max()>1 or item_df['matching_score'].min()<0:
        scaler = MinMaxScaler(feature_range=(0.1,0.90))
        item_df['matching_score'] = pd.Series(scaler.fit_transform(item_df['matching_score'].to_numpy().reshape(-1, 1)).reshape(-1))
    item_df.rename({"all_unique_id":"item_id"},inplace=True, axis=1)
    return item_df.head(N).to_dict(orient='records')

def cs_profile_item_recommendation(new_profile_attributes,similar_profile_id,N=10,min_budget=0,max_budget=None,test_sample_flag=False,explicit_filters=None):
    """
    Cold-Start Profile-Item recommendation, (uses Interaction between similar profile-item and attributes of similar profile and item)
    generate list of item recommendation for the given existing profile id.
    """
    if explicit_filters:
        filter_dict,hard_filter_attrs,soft_filter_attrs,semi_hard_filter_attrs = filter_attributes(**explicit_filters,new_attributes_list=new_profile_attributes)
    else:
        filter_dict,hard_filter_attrs,soft_filter_attrs,semi_hard_filter_attrs = filter_attributes(**Global_Obj.category_filters,new_attributes_list=new_profile_attributes)

    item_df = LightFM_Obj.cold_start_profile_item_recommendation(filter_dict,hard_filter_attrs,new_profile_attributes,similar_profile_id,Global_Obj=Global_Obj,min_budget=min_budget,max_budget=max_budget,test_sample_flag=test_sample_flag,explicit_filters=explicit_filters)[['all_unique_id','title','tags','matching_score']]
    item_df.reset_index(drop=True,inplace=True)
    if item_df.shape[0]==0:
        return []
    
    if item_df['matching_score'].max()>1 or item_df['matching_score'].min()<0:
        scaler = MinMaxScaler(feature_range=(0.1,0.90))
        item_df['matching_score'] = pd.Series(scaler.fit_transform(item_df['matching_score'].to_numpy().reshape(-1, 1)).reshape(-1))
    item_df.rename({"all_unique_id":"item_id"},inplace=True, axis=1)
    return item_df.head(N).to_dict(orient='records')
    # return item_df.to_dict(orient='records')

def cs_similar_items_with_text_sim(new_item_attributes,content_attr=None,N=10,min_budget=0,max_budget=None,test_sample_flag=False,explicit_filters=None):
    """
    Cold-Start similar items with text similarity.
    generate list of similar items,which combine the similarity scores of both item attributes and content attribute - item description. 
    """
    if explicit_filters:
        filter_dict,hard_filter_attrs,soft_filter_attrs,semi_hard_filter_attrs = filter_attributes(**explicit_filters,new_attributes_list=new_item_attributes)
    else:
        filter_dict,hard_filter_attrs,soft_filter_attrs,semi_hard_filter_attrs = filter_attributes(**Global_Obj.category_filters,new_attributes_list=new_item_attributes)

    item_df = LightFM_Obj.cold_start_similar_items_with_text_sim(filter_dict,hard_filter_attrs=hard_filter_attrs,soft_filter_attrs=soft_filter_attrs,Global_Obj=Global_Obj,N=N,content_attr=content_attr,min_budget=min_budget,max_budget=max_budget,test_sample_flag=test_sample_flag,explicit_filters=explicit_filters)
    if item_df.shape[0]==0:
        return []
    item_df = item_df[['left_all_unique_id','title','tags','left_score']].copy()
    item_df.rename(columns={'left_all_unique_id':'item_id','left_score':'matching_score'},inplace=True)
    item_df.reset_index(drop=True,inplace=True)
    if item_df['matching_score'].max()>1 or item_df['matching_score'].min()<0:
        scaler = MinMaxScaler(feature_range=(0.1,0.90))
        item_df['matching_score'] = pd.Series(scaler.fit_transform(item_df['matching_score'].to_numpy().reshape(-1, 1)).reshape(-1))
    
    return item_df.to_dict(orient='records')

async def train_with_mongodb(hil_flag = False,is_active_flag=True,weight_flag=True):
    """
    Retrain the Model
    re-train the model by extracting the latest available data from mongodb(Products, Profiles and Useractivites collection).
    """
    try:
        try:
            Mongodb_Obj.connect()
                
            df_items = Mongodb_Obj.get_collection_as_dataframe(env.DATABASE_NAME,"products")
            filter_condition = True
            if is_active_flag:
                filter_condition = (filter_condition) & (df_items["is_active"]==is_active_flag)
            if hil_flag:
                filter_condition = (filter_condition) & (df_items['hil']==hil_flag)
            df_items = df_items[filter_condition]

            df_users = Mongodb_Obj.get_collection_as_dataframe(env.DATABASE_NAME,"profiles")
            df_users.rename({"preferences":"tags",
                             "user_id":"userId"},inplace=True, axis=1)
            
            df_interactions = Mongodb_Obj.get_collection_as_dataframe(env.DATABASE_NAME,"useractivities")
            df_interactions.dropna(inplace=True)
            df_interactions.rename({"product_id":"productId",
                                    "user_id":"userId",
                                    "profile_id":"profileId",
                                    "activity":"activity_type"},inplace=True, axis=1)
            if df_interactions.empty:    ### if empty interaction create a dummy interaction.
                single_user = df_users.sample()
                single_item = df_items.sample()
                df_interactions = pd.DataFrame(data=[[str(single_item["_id"].values[0]),str(single_user['userId'].values[0]),str(single_user["_id"].values[0]),"like"]]
                                ,columns=['productId', 'userId', 'profileId', 'activity_type'])
            # df_interactions = df_interactions[df_interactions['activity_type']!="dislike"]
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

        rdf_profiles = df_users[['_id','tags']].copy()
        rdf_profiles['_id'] = rdf_profiles['_id'].astype(str)
        rdf_profiles['tags'] = rdf_profiles['tags'].apply(lambda eachList : list(map(lambda x: x.strip().lower(), eachList)) )
        rdf_profiles['tags'] = rdf_profiles['tags'].apply(lambda eachList : list(set(eachList) & set(Global_Obj.attr_list)))

        df_users['all_unique_id'] = df_users['_id'].astype(str).copy()
        df_items['all_unique_id'] = df_items['_id'].astype(str).copy()

        rdf_profiles.rename(columns={"_id":"profileID","tags":"profile_attr_list"},inplace=True)
        rdf_items.rename(columns={"_id":"itemID","tags":"item_attr_list"},inplace=True)
        rdf_interactions.rename(columns={"profileId":"profileID","productId":"itemID"},inplace=True)

        rdf_interactions = rdf_interactions[rdf_interactions['profileID'].isin(set(rdf_profiles['profileID']))]
        rdf_interactions = rdf_interactions[rdf_interactions['itemID'].isin(set(rdf_items['itemID']))]

        LightFM_Obj.Re_Train(rdf_profiles.to_dict(orient='list'),
                rdf_items.to_dict(orient='list'),
                rdf_interactions.to_dict(orient='list'),
                Global_Obj.attr_list,
                df_users,
                df_items,
                df_interactions,
                Global_Obj
                )
        await LightFM_Obj.model_cache_saver()

    except Exception as e:
        return {"status":False,
                "message" : f"Error in re-train :{e}"}
        
    return {"status":True,
            "message": "model re-train succesful and loaded with new weights"}

def test_with_sample(N):
    """
    Generate metrics for sample test cases.
    it uses 'Giftzaza_Test Case.csv' available in repo which has sample profiles and expected recommendations.
    for each sample profile new recommendations are extract in realtime and return the precision and recall.
    """
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


async def create_recommendation(user_id,new_attributes,content_attr=None,N=20,min_budget=0,max_budget=None,test_sample_flag=False,explicit_semi_hard_filters=None):
    """
    Generates Recommendations for the given user
        create recommendation for the respective user_id based upon the scenario.
        
        :user_id - str : profile id for the respective profile for which recommendation has to be generated.
        :new_attributes - list[str] : profile attribute list
        :content_attr - str : content attribute or text mentioning about the product
        :N - int : Number of recommendations
        :min_budget - int : minimum price of the product
        :max_budget - int : maximum price of the prodcut
        :explicit_semi_hard_filters - list[str] : to create custom semi hard filter for infinite scrolling
    """
    await LightFM_Obj.model_cache_loader()
    explicit_filters = None
    if type(explicit_semi_hard_filters) == list:
        explicit_filters = {}
        explicit_filters["hard_filters"] = Global_Obj.category_filters["hard_filters"]
        if bool(set(explicit_filters["hard_filters"]).intersection(set(explicit_semi_hard_filters))):
            raise Exception(f'Given One of the field is the Mandatory Hard Filter : {set(explicit_filters["hard_filters"]).intersection(set(explicit_semi_hard_filters))}')
        explicit_filters["semi_hard_filters"] = list(set(Global_Obj.cat_dict.keys()).intersection(set(explicit_semi_hard_filters)))
        explicit_filters["soft_filters"] = list(set(Global_Obj.cat_dict.keys()).difference(set(explicit_filters['hard_filters']+explicit_filters['semi_hard_filters'])))
        if len(explicit_filters["soft_filters"])==0:
            raise Exception("Atleast One Soft Filter is Needed")
    df_similar_profile = pd.DataFrame(cs_similar_profile(new_attributes,N=10,explicit_filters=explicit_filters))
    if df_similar_profile.shape[0] > 0:
        similar_profile_cutoff = df_similar_profile[df_similar_profile['matching_score']>0.85][:5]
        if similar_profile_cutoff.shape[0] > 0: ### No similar Profile
            profile_user_id = LightFM_Obj.get_userid_of_profile(similar_profile_cutoff,user_id) ### similar profile from same user
            if profile_user_id:
                for profile_id in profile_user_id:
                    if LightFM_Obj.check_profile_interaction(profile_id=profile_id):
                        return cs_profile_item_recommendation(new_profile_attributes=new_attributes,similar_profile_id=profile_id,N=N,min_budget=min_budget,max_budget=max_budget,test_sample_flag = test_sample_flag,explicit_filters=explicit_filters)
            ####  If No Similar profile from same user - Popular recommendation from all profile
            popular_recommdendations = []
            for profile_id in similar_profile_cutoff['user_id'].to_list():
                try:
                    if LightFM_Obj.check_profile_interaction(profile_id=profile_id):
                        popular_recommdendations.extend(cs_profile_item_recommendation(new_profile_attributes=new_attributes,similar_profile_id=profile_id,N=N,min_budget=min_budget,max_budget=max_budget,test_sample_flag = test_sample_flag,explicit_filters=explicit_filters))
                except Exception as e:
                    raise Exception(f"Error in Getting Similar Profile recommdendation : {e}")
            if popular_recommdendations:
                popular_recommdendations = pd.DataFrame(popular_recommdendations).sort_values(by='matching_score',ascending=False)
                popular_recommdendations.drop_duplicates(subset=["item_id"], keep="first", inplace=True)
                popular_recommdendations.reset_index(drop=True,inplace=True)
                return popular_recommdendations.to_dict(orient='records')[:N]
    #### if No interaction for any of the profiles
    if content_attr:
        return cs_similar_items_with_text_sim(new_item_attributes=new_attributes,content_attr=content_attr,N=N,min_budget=min_budget,max_budget=max_budget,test_sample_flag=test_sample_flag,explicit_filters=explicit_filters)
    return cs_similar_items(new_item_attributes=new_attributes,N=N,min_budget=min_budget,max_budget=max_budget,test_sample_flag=test_sample_flag,explicit_filters=explicit_filters)


LightFM_Obj = LightFM_cls()
Mongodb_Obj = Mongodb_cls(username=env.DATABASE_USER,password=env.DATABASE_PWD)
Global_Obj = Global_cls()
# asyncio.run(train_with_mongodb())

# loop = asyncio.get_event_loop()

# policy = asyncio.get_event_loop_policy()
# policy.set_event_loop(policy.new_event_loop())
# loop = asyncio.get_event_loop()

# loop.run_until_complete(train_with_mongodb())
# loop.close()