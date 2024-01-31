import os
import sys
from src.lightfm_model.Model import LightFM_cls
import json

LightFM_Obj = LightFM_cls()

def similar_users_endpoint(user_id,N=10):
    udf = LightFM_Obj.similar_existing_user(user_id,N)[['left_all_unique_id','left_score']].copy()
    udf.rename(columns={'left_all_unique_id':'user_id','left_score':'matching_score'},inplace=True)
    return udf.to_dict(orient='records')

def similar_items_endpoint(item_id,N=10):
    idf = LightFM_Obj.similar_existing_item(item_id,N)[['left_all_unique_id','left_score']].copy()
    idf.rename(columns={'left_all_unique_id':'item_id','left_score':'matching_score'},inplace=True)
    return idf.to_dict(orient='records')

def cs_similar_items(new_item_attriutes,N=10):
    idf = LightFM_Obj.cold_start_similar_items(new_item_attriutes=new_item_attriutes,N=N)[['left_all_unique_id','left_score']].copy()
    idf.rename(columns={'left_all_unique_id':'item_id','left_score':'matching_score'},inplace=True)
    return idf.to_dict(orient='records')
