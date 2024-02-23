import { decodeToken } from "./decodeToken";

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
    localStorage.removeItem("__giftzaza__");
  } catch (error) {
    console.log(error, "err");
    return errorMessage(error);
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