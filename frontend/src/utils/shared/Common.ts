import { decodeToken } from "./DecodeToken";

export const errorMessage = (error: any) => {
  if (error?.response?.data?.message) {
    return { data: null, error: error?.response?.data?.message };
  } else if (error?.message) {
    return { data: null, error: error?.message };
  } else {
    return { data: null, error: "Something went wrong!" };
  }
};

export const logOut = () => {
  try {
    // const response = await axios.post(`${baseURL}/logout/`);
    localStorage.clear();
  } catch (error) {
    console.log(error, "err");
    return errorMessage(error);
  }
};

export const userInfo = () => {
  const token = localStorage.getItem("__hpad__");
  return token ? decodeToken(token) : null;
};

export const formatHTML = (htmlString : any) => {
  const formattedString = htmlString
    ?.replace(/\n/g, '<br>') // Replace \n with <br> for line breaks
    ?.replace(/\*\*(.*?)\*\*/g, (_ : any, htmlString: any) => `<strong>${htmlString}</strong>`); // Wrap **...** with <strong>

  return { __html: formattedString };
};