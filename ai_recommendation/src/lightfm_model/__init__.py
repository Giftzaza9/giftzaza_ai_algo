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

LightFM_Obj = LightFM_cls()
Mongodb_Obj = Mongodb_cls()

BASE_PATH = os.path.dirname(__file__)

with open(os.path.join(Path(BASE_PATH).parent.absolute(), "lib", "category.json"),'r') as fr:
    cat_odata = json.load(fr)
    cat_odata.pop("gpt_assistance")
    attr_list= []
    attr_weights = {}
    hard_filters=["gender","age_category"]
    preprocess_str = lambda x: x.strip().lower()
    cat_dict = {}
    for i in cat_odata:
        if cat_odata[i].get('keyword_search',None):
            keys=list(map(preprocess_str,list(cat_odata[i]['category'].keys())))
            cat_dict[i] = keys
        else:
            keys=list(map(preprocess_str,cat_odata[i]['category']))
            cat_dict[i] = keys
        if i not in hard_filters: ### Hard Filters removed from the model parameters
                attr_list.extend(keys)
                attr_weights.update(dict(zip(keys,[cat_odata[i].get("manual_weights",1) for _ in range(len(keys))])))
            

def similar_users_endpoint(user_id,N=10):
    udf = LightFM_Obj.similar_existing_user(user_id,N)[['left_all_unique_id','left_score']].copy()
    udf.rename(columns={'left_all_unique_id':'user_id','left_score':'matching_score'},inplace=True)
    return udf.to_dict(orient='records')

def similar_items_endpoint(item_id,N=10):
    idf = LightFM_Obj.similar_existing_item(item_id,N)[['left_all_unique_id','title','tags','left_score']].copy()
    idf.rename(columns={'left_all_unique_id':'item_id','left_score':'matching_score'},inplace=True)
    return idf.to_dict(orient='records')

def cs_similar_items(new_item_attriutes,N=10):
    filter_dict = {}
    hard_filter_attrs = []
    for i in hard_filters:
        common_list = list(set(cat_dict[i]) & set(new_item_attriutes))
        hard_filter_attrs.extend(common_list)
        filter_dict.update({i: common_list})
    soft_filter_attrs = list(set(new_item_attriutes).difference(set(hard_filter_attrs)))

    idf = LightFM_Obj.cold_start_similar_items(hard_filter_attrs=hard_filter_attrs,soft_filter_attrs=soft_filter_attrs,N=N)
    idf = idf[['left_all_unique_id','title','tags','left_score']].copy()
    idf.rename(columns={'left_all_unique_id':'item_id','left_score':'matching_score'},inplace=True)
    
    return idf.to_dict(orient='records')

def user_item_recommendation(user_id,N=10):
    idf = LightFM_Obj.user_item_recommendation(user_id)[['all_unique_id','title','ranking_score']].rename(columns={"ranking_score":"score"})
    return idf.head(N).to_dict(orient='records')

def cs_user_item_recommendation(new_user_attriutes,N=10):
    filter_dict = {}
    all_filter_values = []
    for i in hard_filters:
        common_list = list(set(cat_dict[i]) & set(new_user_attriutes))
        all_filter_values.extend(common_list)
        filter_dict.update({i: common_list})
    filter_user_attriutes = list(set(new_user_attriutes).difference(set(all_filter_values)))

    idf = LightFM_Obj.cold_start_user_item_recommendation(filter_user_attriutes)[['all_unique_id','title','tags','ranking_score']].rename(columns={"ranking_score":"score"})
    idf['tags'] = idf['tags'].apply(lambda eachList : list(map(preprocess_str,ast.literal_eval(eachList))))

    return idf[idf['tags'].apply(lambda eachList : set(all_filter_values).issubset(set(eachList)))].head(N).to_dict(orient='records')
    # return idf.to_dict(orient='records')

def train_with_mongodb():
    Mongodb_Obj.connect()
    df_items = Mongodb_Obj.get_collection_as_dataframe("test","products")
    # df_users = Mongodb_Obj.get_collection_as_dataframe("test","profiles")
    df_users = pd.DataFrame(data = [['test_profile_id1',[],np.random.randint(10),list(np.random.choice(attr_list,10))]],
                           columns = ['_id', 'recommended_products', '__v','tags'])
    # df_interactions = Mongodb_Obj.get_collection_as_dataframe("test","useractivities")
    df_interactions = pd.DataFrame(data = [["test_activity_id1",'65b369606932958a4f56f4d2',"test_user_id1",np.random.randint(10),'test_profile_id1']],
                                   columns = ['_id', 'productId', 'userId', '__v', 'profileId'] )
    
    
    rdf_interactions = df_interactions[['profileId','productId']].copy()
    rdf_interactions = rdf_interactions.astype(str)

    rdf_items = df_items[['_id','tags']].copy()
    rdf_items['_id'] = rdf_items['_id'].astype(str)
    rdf_items['tags'] = rdf_items['tags'].apply(lambda eachList : list(map(lambda x: x.strip().lower(), eachList)) )
    rdf_items['tags'] = rdf_items['tags'].apply(lambda eachList : list(set(eachList) & set(attr_list)))
    ### with weights assigned
    # rdf_items['tags'] = rdf_items['tags'].apply(lambda eachList : {key: attr_weights[key] for key in attr_weights.keys() & set(eachList)})

    rdf_users = df_users[['_id','tags']].copy()
    rdf_users['_id'] = rdf_users['_id'].astype(str)
    rdf_users['tags'] = rdf_users['tags'].apply(lambda eachList : list(map(lambda x: x.strip().lower(), eachList)) )
    rdf_users['tags'] = rdf_users['tags'].apply(lambda eachList : list(set(eachList) & set(attr_list)))

    df_users['all_unique_id'] = df_users['_id'].copy()
    df_items['all_unique_id'] = df_items['_id'].copy()

    LightFM_Obj.Re_Train(rdf_users.rename(columns={"_id":"userID","tags":"user_attr_list"}).to_dict(orient='list'),
            rdf_items.rename(columns={"_id":"itemID","tags":"item_attr_list"}).to_dict(orient='list'),
            rdf_interactions.rename(columns={"profileId":"userID","productId":"itemID"}).to_dict(orient='list'),
            attr_list,
            df_users,
            df_items
            )
    return True
    
    


