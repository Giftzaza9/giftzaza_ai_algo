const axios = require('axios');

const axiosInstance = axios.create({
  baseURL: process.env.AI_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

module.exports = axiosInstance;