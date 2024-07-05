import { BudgetMap, Profile } from './types';
import { GoHomeFill } from 'react-icons/go';
import { Bookmark, GridViewRounded, PersonRounded } from '@mui/icons-material';
import categoryData from './category.json';
import { generateBudgetMap } from '../utils/helperFunctions';

export const navbarSettings = ['Logout'];

export const sortOptions = [
  { label: 'Latest', value: 'latest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Price: low to high', value: 'price-lo-to-hi' },
  { label: 'Price: high to low', value: 'price-hi-to-lo' },
  { label: 'Alphabetic: ascending', value: 'alpha-asc' },
  { label: 'Alphabetic: descending', value: 'alpha-desc' },
  { label: 'Likes: ascending', value: 'likes-asc' },
  { label: 'Likes: descending', value: 'likes-desc' },
];

export const filterObject = {
  gender: categoryData.gender.category,
  age_category: categoryData.age_category.category,
  interest: Object.keys(categoryData.interest.category),
  occasion: categoryData.occasion.category,
  relationship: categoryData.relationship.category,
  style: categoryData.style.category,
  budget: categoryData.budget.category,
};

export const relationShipMap = {
  Husband: { relation: 'Spouse or Significant Other', gender: 'male' },
  Wife: { relation: 'Spouse or Significant Other', gender: 'female' },
  Boyfriend: { relation: 'Girlfriend', gender: 'male' },
  Girlfriend: { relation: 'Girlfriend', gender: 'female' },
  Son: { relation: 'Child', gender: 'male' },
  Daughter: { relation: 'Child', gender: 'female' },
  Father: { relation: 'Parent', gender: 'male' },
  Mother: { relation: 'Parent', gender: 'female' },
  Grandfather: { relation: 'Grand Parent', gender: 'male' },
  Grandmother: { relation: 'Grand Parent', gender: 'female' },
  'Male Friend': { relation: 'Friend', gender: 'male' },
  'Female Friend': { relation: 'Friend', gender: 'female' },
  'Male Colleague': { relation: 'Colleague', gender: 'male' },
  'Female Colleague': { relation: 'Colleague', gender: 'female' },
};

export const budgetMap: BudgetMap = generateBudgetMap(categoryData.budget.category);

export const productPerPageAdmin = 12;

export const addNewProductSteps = ['Link', 'Product Info', 'Preview'];

export const bottomNavHidePaths = ['welcome', 'login', 'admin'];

export const landingChips = {
  forHusband: 'Gifts for your husband',
  forMom: 'Gifts for your mom',
  createNew: 'Create a new giftee profile',
  view: 'View existing giftee profiles',
  shopping: 'Start shopping',
};

export enum SwipeAction {
  LIKE = 'like',
  BUY = 'buy',
  DISLIKE = 'dislike',
  SAVE = 'save',
  SIMILAR = 'similar',
  NO_INTERACTION = 'no interaction',
  FINISHED = 'FINISHED',
  REWIND = 'rewind',
}

export const iphoneSeCondition = '(max-width: 389px) or (max-height: 700px)';
export const lowWidthCondition = '(max-width: 420px)';
export const lowHeightCondition = '(max-height: 550px)';

export const bottomNavIcons = [
  {
    value: 'home',
    Icon: GoHomeFill,
    href: '/',
  },
  {
    value: 'profiles',
    Icon: GridViewRounded,
    href: '/profiles',
  },
  {
    value: 'saved',
    Icon: Bookmark,
    href: '/saved',
  },
  {
    value: 'user',
    Icon: PersonRounded,
    href: '/user',
  },
];

// eslint-disable-next-line no-useless-escape
export const kickOutMessages = ['Error: No auth token', `\"refreshToken\" must be a string`, `Please authenticate`];

export enum Steps {
  LANDING = 0,
  RELATION = 1,
  AGE = 2,
  NAME = 3,
  OCCASION = 4,
  DATE = 5,
  BUDGET = 6,
  STYLE = 7,
  INTEREST = 8,
  END = 9,
}

export const initialProfileData: Partial<Profile> = {
  styles: [],
  interests: [],
  title: '',
  relation: '',
  age: '',
  gender: '',
  occasion: '',
  occasion_date: '',
  budget: '',
};
