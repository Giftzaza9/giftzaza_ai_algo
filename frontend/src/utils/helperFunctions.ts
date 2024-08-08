import { isAxiosError } from 'axios';
import { ApiResponse, BudgetMap } from '../constants/types';
import { decodeToken } from './decodeToken';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { createErrorLog } from '../services/error';
import { CreateProfileBody } from '../services/profile';
import { filterObject } from '../constants/constants';

export const generateErrorMessage = async (error: Error | unknown): Promise<ApiResponse> => {
  let message: string = '';
  if (isAxiosError(error) && error?.response?.data?.message) {
    message = error?.response?.data?.message;
    console.error(message);
    toast.error(message);
    try {
      await createErrorLog(message, error?.response?.data?.stack || error?.response?.data?.toString());
    } catch (error) {}
    return { data: null, error: message, status: error?.response?.status };
  } else if ((error as Error)?.message) {
    message = (error as Error)?.message;
    console.error(message);
    toast.error(message);
    try {
      await createErrorLog(message, error?.toString());
    } catch (error) {}
    return { data: null, error: message, status: 500 };
  } else {
    console.error(error);
    message = 'Something went wrong!';
    toast.error(message);
    try {
      await createErrorLog(message, error?.toString());
    } catch (error) {}
    return { data: null, error: message, status: 500 };
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

export const profilePayloadCleaner = (payload: CreateProfileBody) => {
  for (const key in payload) {
    if (key === 'title' && !payload[key]) {
      payload[key] = `Gift for ${payload.relation}`;
    } else if (!payload?.[key as keyof CreateProfileBody]) {
      payload[key as keyof CreateProfileBody] = undefined as never;
    }
  }
  return payload;
};

export function generateBudgetMap(budget: any): BudgetMap {
  const budgetMap: BudgetMap = {};

  for (let i = 0; i < budget?.length; i++) {
    const category = budget[i];
    const range = category.split('-');

    if (range?.length === 1) {
      // Handle "< $200" and "$200+" cases
      const max = range[0].includes('<') ? parseInt(range[0].slice(3)) : parseInt(range[0].slice(1));
      budgetMap[category] = { min: 0, max: max };
    } else {
      // Handle "$200-$400" to "$1000-$2000" cases
      const min = parseInt(range[0].slice(1));
      const max = parseInt(range[1].slice(1));
      budgetMap[category] = { min: min, max: max };
    }
  }

  // Add infinite max value for the last category
  const lastCategory = budget[budget?.length - 1];
  const lastMax = lastCategory.includes('+') ? Number.MAX_SAFE_INTEGER : parseInt(lastCategory.split('-')[1]);
  budgetMap[lastCategory] = { min: parseInt(lastCategory.split('-')[0].slice(1)), max: lastMax };

  return budgetMap;
}


export const isInterestIncluded = (preferences: string[]): boolean => {
 return filterObject.interest.some((interest) => preferences?.map(el => el.toLowerCase()).includes(interest?.toLowerCase()));

}
