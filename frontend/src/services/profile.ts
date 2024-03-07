import { generateErrorMessage } from '../utils/helperFunctions';
import { ApiResponse, ProfileDataWithPrice } from '../constants/types';
import axiosInstance from './axiosInstance';

export const createProfile = async (payload: ProfileDataWithPrice): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.post(`/profiles`, payload);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};
