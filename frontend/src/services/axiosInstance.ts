import axios from 'axios';
import { baseURL } from '../constants/vars';
import { refreshToken } from './auth';
import { errorMessages } from '../constants/constants';

const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const store: string = localStorage.getItem('access_giftalia')!;
    const token = JSON.parse(store);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const errorMessage = error.response.data?.message;
    console.log(error);
    if (error.response.status === 401 && !originalRequest._retry && errorMessage === 'TokenExpiredError: jwt expired') {
      originalRequest._retry = true;
      await refreshToken();
      return axiosInstance(originalRequest);
    } else if (error.response.status === 401 && errorMessages.some((el) => el === errorMessage)) {
      window.location.pathname = '/dashboard/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
