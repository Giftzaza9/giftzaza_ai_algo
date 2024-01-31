import ast
import pandas as pd
import pickle
import os
import numpy as np
# from lightfm import LightFM
from lightfm.data import Dataset
import numpy as numpy
from recommenders.models.lightfm.lightfm_utils import (
    similar_users,
    similar_items,
)

BASE_PATH = os.path.dirname(__file__)

class LightFM_cls:
    def __init__(self) -> None:
        self.model = pickle.load(open(os.path.join(BASE_PATH, "lib", "model.pkl"), 'rb'))
        self.user_features = pickle.load(open(os.path.join(BASE_PATH, "lib", "user_features.pkl"), 'rb'))
        self.item_features = pickle.load(open(os.path.join(BASE_PATH, "lib", "item_features.pkl"), 'rb'))
        self.dataset = pickle.load(open(os.path.join(BASE_PATH, "lib", "dataset_builder.pkl"), 'rb'))
        self.user_mapper,self.user_fmapper,self.item_mapper,self.item_fmapper = self.dataset.mapping()
        self.ruser_mapper = dict([(v,k) for k,v in self.user_mapper.items()])
        self.ritem_mapper = dict([(v,k) for k,v in self.item_mapper.items()])
        self.ruser_fmapper = dict([(v,k) for k,v in self.user_fmapper.items()])
        self.ritem_fmapper = dict([(v,k) for k,v in self.item_fmapper.items()])
        self.user_meta = pd.read_csv(os.path.join(BASE_PATH, "lib","user_meta.csv"))
        self.item_meta = pd.read_csv(os.path.join(BASE_PATH, "lib", "item_meta.csv"))

    def similar_existing_user(self,original_user_id,N=10):
        try:
            user_id = self.user_mapper[original_user_id]
        except Exception as e:
            raise KeyError("Given User Id is not present in Model")
        udf = similar_users(user_id=user_id, 
              user_features=self.user_features, 
              model=self.model,
              N=N)
        udf['all_unique_id'] = udf['userID'].map(self.ruser_mapper)
        udf.columns = 'left_' + udf.columns.values
        matched_user_meta = udf.merge(self.user_meta,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_user_meta
    
    def similar_existing_item(self,original_item_id,N=10):
        try:
            item_id = self.item_mapper[original_item_id]
        except Exception as e:
            raise KeyError("Given Item Id is not present in Model")
        idf = similar_items(item_id=item_id, 
              item_features=self.item_features, 
              model=self.model,
              N=N)
        idf['all_unique_id'] = idf['itemID'].map(self.ritem_mapper)
        idf.columns = 'left_' + idf.columns.values
        matched_item_meta = idf.merge(self.item_meta,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_item_meta
    
    def cold_start_similar_items(self,new_item_attriutes, N=10):
        feat_idxs = [self.item_fmapper.get(key) for key in new_item_attriutes]
        i_biases, item_representations = self.model.get_item_representations(features=self.item_features)
        summation = 0
        for idx in feat_idxs:
            summation += (self.model.item_embeddings[idx] )
        scores = item_representations.dot(summation)
        item_norms = np.linalg.norm(item_representations, axis=1)
        item_vec_norm = np.linalg.norm(summation)
        scores = np.squeeze(scores / item_norms / item_vec_norm)

        best = np.argsort(-scores)[0 : N]
        idf = sorted(zip(best, scores[best]), key=lambda x: -x[1])
        idf = pd.DataFrame(idf,columns=['itemID','score'])
        idf['all_unique_id'] = idf['itemID'].map(self.ritem_mapper)
        idf.columns = 'left_' + idf.columns.values
        matched_item_meta = idf.merge(self.item_meta,left_on=['left_all_unique_id'],right_on=['all_unique_id'],copy=True)
        return matched_item_meta

