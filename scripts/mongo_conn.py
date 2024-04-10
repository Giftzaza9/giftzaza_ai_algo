# import numpy as np
import pandas as pd
from pymongo import MongoClient
from pprint import pprint
from bson.objectid import ObjectId


username = ""
password = ""


class Mongodb_cls:
    def __init__(self) -> None:
        self.uri = f"mongodb+srv://{username}:{password}@giftzaza.hr6do3t.mongodb.net/?retryWrites=true&w=majority"
        self.client = None

    def connect(self):
        self.client = MongoClient(self.uri)
        try:
            self.client.admin.command("ping")
            print("Pinged your deployment. You successfully connected to MongoDB!")
            return True
        except Exception as e:
            print(e)
            return False

    def get_collection_as_dataframe(
        self, database_name, collection_name, query: dict = {}
    ):
        db = self.client[database_name]
        return pd.DataFrame((db[collection_name].find(query)))

    def get_count(self, database_name, collection_name, query: dict = {}):
        db = self.client[database_name]
        return db[collection_name].count_documents(query)


Mongodb_Obj = Mongodb_cls()
Mongodb_Obj.connect()
# products = Mongodb_Obj.client.test.products
products = Mongodb_Obj.client.giftalia_prod.analysisproducts
