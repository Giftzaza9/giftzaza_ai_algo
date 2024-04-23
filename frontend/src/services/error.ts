import axiosInstance from './axiosInstance';

export const createErrorLog = async (errorMessage: string, errorStack: string = ''): Promise<any> => {
  try {
    const { data, status } = await axiosInstance.post(`/error-log`, {
      message: errorMessage,
      platform: 'frontend-react',
      error_stack: errorStack,
    });
    return { data, status, error: null };
  } catch (error) {
    console.log(error);
  }
};
