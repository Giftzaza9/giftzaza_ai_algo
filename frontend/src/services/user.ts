import { generateErrorMessage } from '../utils/helperFunctions';
import { ApiResponse } from '../constants/types';
import axiosInstance from './axiosInstance';
import { SwipeAction } from '../constants/constants';
// import { isAxiosError } from 'axios';

export interface userActivityBody {
  profile_id: string;
  product_id: string;
  activity: SwipeAction;
}

export const storeUserActivity = async (payload: userActivityBody): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.post(`/user-activity`, payload);
    return { data, status, error: null };
  } catch (error) {
    // if (isAxiosError(error) && (error?.response?.data as { message?: string })?.message === 'User activity already captured')
    //   return { data: null, status: 400, error: 'User activity already captured' };
    return generateErrorMessage(error);
  }
};
