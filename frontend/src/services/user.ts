import { generateErrorMessage } from '../utils/helperFunctions';
import { ApiResponse } from '../constants/types';
import axiosInstance from './axiosInstance';
import { SwipeAction } from '../constants/constants';
// import { isAxiosError } from 'axios';

export interface UserActivityBody {
  profile_id: string;
  product_id: string;
  activity: SwipeAction;
}

export const storeUserActivity = async (payload: UserActivityBody): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.post(`/user-activity`, payload);
    return { data, status, error: null };
  } catch (error) {
    // if (isAxiosError(error) && (error?.response?.data as { message?: string })?.message === 'User activity already captured')
    //   return { data: null, status: 400, error: 'User activity already captured' };
    return generateErrorMessage(error);
  }
};

export const getSavedProducts = async (): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.get(`/user-activity/saved`);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};

export interface RemoveSavedProductBody {
  product_id: string;
  profile_id: string;
}

export const removeSavedProduct = async (payload: RemoveSavedProductBody): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.delete(`/user-activity/saved`, { data: payload });
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};
