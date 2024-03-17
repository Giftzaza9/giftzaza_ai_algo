from typing import Optional, Annotated, Union, List
from pydantic import BaseModel


class similar_existing_item_schema(BaseModel):
    item_id : str
    top_n : Optional[int] = 10

class similar_existing_user_schema(BaseModel):
    user_id : str
    top_n : Optional[int] = 10

class cs_similar_user_schema(BaseModel):
    new_user_attributes :  List[str]
    top_n : Optional[int] = 10

class cs_similar_item_schema(BaseModel):
    new_item_attributes :  List[str]
    top_n : Optional[int] = 10

class user_item_recommendation_schema(BaseModel):
    user_id : str
    top_n : Optional[int] = 10

class cs_user_item_recommendation_schema(BaseModel):
    new_user_attributes :  List[str]
    top_n : Optional[int] = 10

class create_recommendation_schema(BaseModel):
    user_id : str
    new_attributes : List[str]
    content_attribute : Optional[str] = None
    top_n : Optional[int] = 10
    min_budget : Optional[int] = 0
    max_budget : Optional[int] = None

class get_metrics_schema(BaseModel):
    at_k : int = 4