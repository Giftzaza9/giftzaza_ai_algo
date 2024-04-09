import { isAxiosError } from 'axios';
import { ApiResponse } from '../constants/types';
import { decodeToken } from './decodeToken';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

export const generateErrorMessage = (error: Error | unknown): ApiResponse => {
  if (isAxiosError(error) && error?.response?.data?.message) {
    console.error(error?.response?.data?.message);
    toast.error(error?.response?.data?.message);
    return { data: null, error: error?.response?.data?.message, status: error?.response?.status };
  } else if ((error as Error)?.message) {
    console.error((error as Error)?.message);
    toast.error((error as Error)?.message);
    return { data: null, error: (error as Error)?.message, status: 500 };
  } else {
    console.error(error);
    toast.error('Something went wrong!');
    return { data: null, error: 'Something went wrong!', status: 500 };
  }
};

export const userInfo = () => {
  const token = localStorage.getItem('access_giftalia');
  return token ? decodeToken(token) : null;
};

export const formatHTML = (htmlString: any) => {
  const formattedString = htmlString
    ?.replace(/\n/g, '<br>') // Replace \n with <br> for line breaks
    ?.replace(/\*\*(.*?)\*\*/g, (_: any, htmlString: any) => `<strong>${htmlString}</strong>`); // Wrap **...** with <strong>

  return { __html: formattedString };
};

export function stringToColor(string: string) {
  if (!string) return '';
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string?.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

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
    children: `${name.split(' ')[0][0]}`,
  };
};

export const ellipsisText = (text: string, maxChars: number) => {
  if (text?.length <= maxChars) {
    return text;
  } else {
    return text?.slice(0, maxChars) + '...';
  }
};

export const getCurrencySymbol = (currency: string) => (currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '$');

export const daysRemaining = (date: string) => {
  const days = dayjs(date).diff(dayjs(), 'days');
  if (days < 0) return 'Expired';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `${days} days`;
};

export const comingUpOn = (date: string) => {
  const days = dayjs(date).diff(dayjs(), 'days');
  if (days < 0) return `expired on ${dayjs(date).format('DD/MM/YYYY')}`;
  if (days === 0) return 'happens today';
  if (days === 1) return 'coming up on tomorrow';
  return `coming up on ${dayjs(date).format('DD/MM/YYYY')}`;
};

export const isMobileBrowser = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const isIPhoneAndPWA = () => {
  const isiPhone = /iPhone/i.test(navigator.userAgent);
  const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
  return isiPhone && isInStandaloneMode;
};

export const getVH = (vH: number) => `calc(var(--vh) * ${vH})`;
