import axios from "axios";
import { generateErrorMessage } from "../utils/helperFunctions";
import { baseURL } from "../constants/vars";

const authBaseUrl = `${baseURL}/auth`

export const loginWithGoogle = async (payload: any) => {
    try {
        const response = await axios.post(`${authBaseUrl}/googleLogin/`, payload);
        if (response.data) {
          const token = response?.data?.tokens?.access?.token;
			    localStorage.setItem('__giftzaza__', JSON.stringify(token));
          return { data: response?.data, error: null, status: response?.status };
        } else {
          return { data: null, error: response?.data?.message, status: response?.status };
        }
      } catch (error: any) {
        return generateErrorMessage(error);
      }
}

export const loginWithFacebook = async (payload: any) => {
    try {
        const response = await axios.post(`${authBaseUrl}/facebookLogin/`, payload);
        if (response.data) {
          const token = response?.data?.tokens?.access?.token;
			    localStorage.setItem('__giftzaza__', JSON.stringify(token));
          return { data: response?.data, error: null, status: response?.status};
        } else {
          return { data: null, error: response?.data?.message, status: response?.status };
        }
      } catch (error: any) {
        return generateErrorMessage(error);
      }
}