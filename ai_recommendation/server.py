import os
import sys
import uvicorn
import json

from fastapi import FastAPI, Query
# from fastapi import Depends, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from src import lightfm_model as lfm
from server_schema import ( similar_existing_item_schema,
                           similar_existing_user_schema,
                           cs_similar_item_schema)

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

@app.post("/get_similar_user")
def get_similar_user(body : similar_existing_user_schema):
    return lfm.similar_users_endpoint(user_id=body.user_id,N=body.top_n)

@app.post("/get_similar_item")
def get_similar_item(body : similar_existing_item_schema):
    return lfm.similar_items_endpoint(item_id=body.item_id,N=body.top_n)

@app.post("/cs_similar_item")
def cs_similar_item(body : cs_similar_item_schema):
    return lfm.cs_similar_items(new_item_attriutes=body.new_item_attriutes,N=body.top_n)


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=False)