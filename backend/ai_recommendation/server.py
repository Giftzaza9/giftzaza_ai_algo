import os
import sys
import uvicorn
import json
from contextlib import asynccontextmanager

from fastapi import FastAPI, Query
# from fastapi import Depends, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from src import lightfm_model as lfm
from server_schema import ( similar_existing_item_schema,
                           similar_existing_profile_schema,
                           cs_similar_profile_schema,
                           cs_similar_item_schema,
                           profile_item_recommendation_schema,
                           cs_profile_item_recommendation_schema,
                           create_recommendation_schema,
                           get_metrics_schema)

# @asynccontextmanager
# async def app_lifespan(app: FastAPI):
#     print("Calling Model Re-Train While On Start")
#     model_retrain()
#     yield
#     # code to execute when app is shutting down

# app = FastAPI(lifespan=app_lifespan)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health-check")
def health_check():
    return "Hello"

@app.post("/get_similar_profile")
def get_similar_profile(body : similar_existing_profile_schema):
    return lfm.similar_profiles_endpoint(profile_id=body.profile_id,N=body.top_n)

@app.post("/get_similar_item")
def get_similar_item(body : similar_existing_item_schema):
    return lfm.similar_items_endpoint(item_id=body.item_id,N=body.top_n)

@app.post("/cs_similar_profile")
def cs_similar_profile(body : cs_similar_profile_schema):
    return lfm.cs_similar_profile(new_profile_attributes=body.new_profile_attributes,N=body.top_n)

@app.post("/cs_similar_item")
def cs_similar_item(body : cs_similar_item_schema):
    return lfm.cs_similar_items(new_item_attributes=body.new_item_attributes,N=body.top_n)

@app.post("/profile_item_recommendation")
def profile_item_recommendation(body : profile_item_recommendation_schema):
    return lfm.profile_item_recommendation(profile_id = body.profile_id,N=body.top_n)

@app.post("/cs_profile_item_recommendation")
def cs_profile_item_recommendation(body : cs_profile_item_recommendation_schema):
    return lfm.cs_profile_item_recommendation(new_profile_attributes=body.new_profile_attributes,
                                              similar_profile_id=body.profile_id,
                                              N=body.top_n)

@app.post("/create_recommendation")
def create_recommendation(body : create_recommendation_schema):
    return lfm.create_recommendation(user_id=body.user_id,
                                     new_attributes=body.new_attributes,
                                     content_attr=body.content_attribute,
                                     N=body.top_n,
                                     min_budget=body.min_price,
                                     max_budget=body.max_price,
                                     explicit_semi_hard_filters=body.semi_hard_filters)

@app.post("/model_retrain")
def model_retrain():
    return lfm.train_with_mongodb()

@app.post("/get_metrics")
def get_metrics(body : get_metrics_schema):
    return lfm.test_with_sample(N=body.at_k)


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=False)