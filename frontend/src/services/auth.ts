import { generateErrorMessage } from '../utils/helperFunctions';
import axiosInstance from './axiosInstance';

export const loginWithGoogle = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/auth/googleLogin/`, payload);
    if (response.data) {
      const accessToken = response?.data?.tokens?.access?.token;
      const refreshToken = response?.data?.tokens?.refresh?.token;
      localStorage.setItem('access_giftalia', JSON.stringify(accessToken));
      localStorage.setItem('refresh_giftalia', JSON.stringify(refreshToken));
      return { data: response?.data, error: null, status: response?.status };
    } else {
      return { data: null, error: response?.data?.message, status: response?.status };
    }
  } catch (error: any) {
    return generateErrorMessage(error);
  }
};

export const loginWithFacebook = async (payload: any) => {
  try {
    const response = await axiosInstance.post(`/auth/facebookLogin/`, payload);
    if (response.data) {
      const accessToken = response?.data?.tokens?.access?.token;
      const refreshToken = response?.data?.tokens?.refresh?.token;
      localStorage.setItem('access_giftalia', JSON.stringify(accessToken));
      localStorage.setItem('refresh_giftalia', JSON.stringify(refreshToken));
      return { data: response?.data, error: null, status: response?.status };
    } else {
      return { data: null, error: response?.data?.message, status: response?.status };
    }
  } catch (error: any) {
    return generateErrorMessage(error);
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = JSON.parse(localStorage.getItem('refresh_giftalia') as string);
    const response = await axiosInstance.post(`/auth/refresh-token`, { refreshToken });
    if (response.data) {
      const accessToken = response?.data?.tokens?.access?.token;
      const refreshToken = response?.data?.tokens?.refresh?.token;
      localStorage.setItem('access_giftalia', JSON.stringify(accessToken));
      localStorage.setItem('refresh_giftalia', JSON.stringify(refreshToken));
      return { data: response?.data, error: null, status: response?.status };
    } else {
      return { data: null, error: response?.data?.message, status: response?.status };
    }
  } catch (error: any) {
    return generateErrorMessage(error);
  }
};

export const logout = async () => {
  try {
    const refreshToken = JSON.parse(localStorage.getItem('refresh_giftalia') as string);
    localStorage.removeItem('access_giftalia');
    localStorage.removeItem('refresh_giftalia');
    const response = await axiosInstance.post(`/auth/logout`, { refreshToken });
    if (response.data) {
      return { data: response?.data, error: null, status: response?.status };
    } else {
      return { data: null, error: response?.data?.message, status: response?.status };
    }
  } catch (error: any) {
    return generateErrorMessage(error);
  }
};
