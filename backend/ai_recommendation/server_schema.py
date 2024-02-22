from typing import Optional, Annotated, Union, List
from pydantic import BaseModel


class similar_existing_item_schema(BaseModel):
    item_id : str
    top_n : Optional[int] = 10

class similar_existing_user_schema(BaseModel):
    user_id : str
    top_n : Optional[int] = 10

class cs_similar_item_schema(BaseModel):
    new_item_attriutes :  List[str]
    top_n : Optional[int] = 10

class user_item_recommendation_schema(BaseModel):
    user_id : str
    top_n : Optional[int] = 10

class cs_user_item_recommendation_schema(BaseModel):
    new_user_attriutes :  List[str]
    top_n : Optional[int] = 10

class get_metrics_schema(BaseModel):
    at_k : int = 4