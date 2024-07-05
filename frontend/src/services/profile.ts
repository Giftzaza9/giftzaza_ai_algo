import { generateErrorMessage } from '../utils/helperFunctions';
import { ApiResponse } from '../constants/types';
import axiosInstance from './axiosInstance';

export interface CreateProfileBody {
  relation: string;
  age: string;
  gender: string;
  title?: string;
  styles?: string[];
  interests?: string[];
  occasion?: string;
  occasion_date?: string;
  min_price?: number;
  max_price?: number;
}

export const createProfile = async (payload: CreateProfileBody): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.post(`/profiles`, payload);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};

export const getProfile = async (profileId?: string): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.get(`/profiles/${profileId}`);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};

export const getProfiles = async (): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.get(`/profiles`);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};
export interface UpdateProfileBody {
  title: string;
  age: string;
  gender: string;
  relation: string;
  occasion?: string;
  occasion_date?: string;
  min_price?: number;
  max_price?: number;
  styles?: string[];
  interests?: string[];
}

export const updateProfile = async (profileId: string, body: UpdateProfileBody): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.patch(`/profiles/${profileId}`, body);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};

export const deleteProfile = async (profileId: string): Promise<ApiResponse> => {
  try {
    const { data, status } = await axiosInstance.delete(`/profiles/${profileId}`);
    return { data, status, error: null };
  } catch (error) {
    return generateErrorMessage(error);
  }
};
