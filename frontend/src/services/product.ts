import { generateErrorMessage, isInterestIncluded } from '../utils/helperFunctions';
import { ApiResponse } from '../constants/types';
import axiosInstance from './axiosInstance';

export const getProducts = async (queryString?: string): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.get(`/products?${queryString ?? ''}`);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};

export interface ScrapeProductBody {
  product_link: string;
}

export const scrapeProduct = async (body: ScrapeProductBody): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.post(`/products/scrape`, body);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};

export interface moreProductBody {
  preferences: string[];
  top_n: number;
  semi_hard_filters?: string[];
  min_price?: number;
  max_price?: number
}

export const moreProducts = async (payload: moreProductBody): Promise<ApiResponse> => {
  try {
    if (payload.semi_hard_filters?.length)
      payload.semi_hard_filters = isInterestIncluded(payload?.preferences || []) ? ['interest'] : [];
    const { data, status } = await axiosInstance.post(`/products/more-products`, payload);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};

export interface SimilarProductBody {
  item_id: string;
  top_n: number;
}

export const getSimilarProducts = async (payload: SimilarProductBody): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.post(`/products/similar-products`, payload);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};

export interface CreateProductBody {
  product_id: string;
  tags: string[];
  curated: boolean;
}

export const createProduct = async (body: CreateProductBody): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.post(`/products`, body);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};

export interface UpdateProductBody {
  tags: string[];
  curated: boolean;
  scrape?: boolean;
}

export const updateProduct = async (product_id: string, body: UpdateProductBody): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.patch(`/products/${product_id}`, body);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};

export const deleteProduct = async (product_id: string): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.delete(`/products/${product_id}`);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};

export interface shoppingBody {
  page?: number;
  limit?: number;
}

export const shopping = async (payload: shoppingBody): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.post(`/products/shopping`, payload);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};
