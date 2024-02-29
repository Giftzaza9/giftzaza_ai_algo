import { isAxiosError } from "axios";
import { ApiResponse } from "../constants/types";
import { decodeToken } from "./decodeToken";
import { toast } from "react-toastify";

export const generateErrorMessage = (error: Error | unknown): ApiResponse => {
  if (isAxiosError(error) && error?.response?.data?.message) {
    toast.error(error?.response?.data?.message);
    return { data: null, error: error?.response?.data?.message, status: error?.response?.status};
  } else if ((error as Error)?.message) {
    toast.error((error as Error)?.message);
    return { data: null, error: (error as Error)?.message, status: 500 };
  } else {
    toast.error("Something went wrong!");
    return { data: null, error: "Something went wrong!", status: 500 };
  }
};

export const logOut = () => {
  try {
    localStorage.removeItem("__giftzaza__");
  } catch (error) {
    console.log(error, "err");
    return generateErrorMessage(error);
  }
};

export const userInfo = () => {
  const token = localStorage.getItem("__giftzaza__");
  return token ? decodeToken(token) : null;
};

export const formatHTML = (htmlString : any) => {
  const formattedString = htmlString
    ?.replace(/\n/g, '<br>') // Replace \n with <br> for line breaks
    ?.replace(/\*\*(.*?)\*\*/g, (_ : any, htmlString: any) => `<strong>${htmlString}</strong>`); // Wrap **...** with <strong>

  return { __html: formattedString };
};

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}`,
  };
}

export const ellipsisText = (text: string, maxChars: number) => {
  if (text.length <= maxChars) {
    return text;
  } else {
    return text.slice(0, maxChars) + '...';
  }
};