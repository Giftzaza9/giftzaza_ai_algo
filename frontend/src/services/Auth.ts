import axios from "axios";
import { errorMessage } from "../utils/shared/Common";

const baseURL = process.env.REACT_APP_BASE_URL;

export const loginWithGoogle = async (payload: any) => {
    try {
        const response = await axios.post(`${baseURL}/googleLogin/`, payload);
        console.log({response})
        if (response.data) {
          const token = response?.data?.tokens?.access?.token;
			    localStorage.setItem('__giftzaza__', JSON.stringify(token));
          return { data: response?.data, error: null };
        } else {
          return { data: null, error: response?.data?.message };
        }
      } catch (error: any) {
        return errorMessage(error);
      }
}

export const loginWithFacebook = async (payload: any) => {
    try {
        const response = await axios.post(`${baseURL}/facebookLogin/`, payload);
        console.log({response})
        if (response.data) {
          const token = response?.data?.tokens?.access?.token;
			    localStorage.setItem('__giftzaza__', JSON.stringify(token));
          return { data: response?.data, error: null };
        } else {
          return { data: null, error: response?.data?.message };
        }
      } catch (error: any) {
        return errorMessage(error);
      }
}