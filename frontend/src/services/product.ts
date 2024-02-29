import axios from 'axios';
import { generateErrorMessage } from '../utils/helperFunctions';
import { baseURL } from '../constants/vars';
import { ApiResponse } from '../constants/types';

const productsBaseUrl = `${baseURL}/products`

export const getProducts = async (queryString?: string): Promise<ApiResponse> => {
  try {
    const { data, status } = await axios.get(`${productsBaseUrl}?${queryString ?? ''}`);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};
