from typing import Optional, Annotated, Union, List
from pydantic import BaseModel


class similar_existing_item_schema(BaseModel):
    item_id : str
    top_n : Optional[int] = 10

class similar_existing_profile_schema(BaseModel):
    profile_id : str
    top_n : Optional[int] = 10

class cs_similar_profile_schema(BaseModel):
    new_profile_attributes :  List[str]
    top_n : Optional[int] = 10

class cs_similar_item_schema(BaseModel):
    new_item_attributes :  List[str]
    top_n : Optional[int] = 10

class profile_item_recommendation_schema(BaseModel):
    profile_id : str
    top_n : Optional[int] = 10

class cs_profile_item_recommendation_schema(BaseModel):
    new_profile_attributes :  List[str]
    profile_id : str
    top_n : Optional[int] = 10

class create_recommendation_schema(BaseModel):
    user_id : str
    new_attributes : List[str]
    content_attribute : Optional[str] = None
    top_n : Optional[int] = 10
    min_price : Optional[int] = 0
    max_price : Optional[int] = None
    semi_hard_filters : Optional[List[str]] = None

class get_metrics_schema(BaseModel):
    at_k : int = 4