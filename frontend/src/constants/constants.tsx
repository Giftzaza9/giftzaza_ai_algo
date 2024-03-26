import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { Product, roleEnum } from './types';

const iconStyle = {
  fontSize: 'large',
  marginBottom: '-3px',
  marginRight: '4px',
};

export const navbarLinks = [
  // {
  //   name: 'Profiles',
  //   link: '/profiles',
  //   icon: <PersonOutlineIcon sx={iconStyle} />,
  //   access: [roleEnum.ADMIN, roleEnum.USER],
  // },
  { name: 'Administration', link: '/admin', icon: <DescriptionOutlinedIcon sx={iconStyle} />, access: [roleEnum.ADMIN] },
  // { name: 'Loved', link: '/loved', icon: <FavoriteBorderIcon sx={iconStyle} />, access: [roleEnum.ADMIN, roleEnum.USER] },
];

export const navbarSettings = ['Logout'];

export const sortOptions = [
  { label: 'Latest', value: 'latest' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Price: low to high', value: 'price-lo-to-hi' },
  { label: 'Price: high to low', value: 'price-hi-to-lo' },
  { label: 'Alphabetic: ascending', value: 'alpha-asc' },
  { label: 'Alphabetic: descending', value: 'alpha-desc' },
];

export const filterObject = {
  gender: ['Male', 'Female'],
  age_category: ['Under 12', '12 - 18', '18 - 25', '25 - 45', '45 - 65', '65 +'],
  interest: [
    'Fitness and Wellness',
    'Tech and Gadgets',
    'Fashion and Accessories',
    'Books and Learning',
    'Travel and Adventure',
    'Food and Cooking',
    'Arts and Crafts',
    'Music and Entertainment',
    'Outdoor and Nature',
    'Beauty and Self-Care',
    'Home and Decor',
    'Sports and Hobbies',
    'Pets and Animal Lovers',
    'Art and Culture',
    'Social Impact and Charity',
    'Spirituality',
  ],
  occasion: [
    'Birthdays',
    'Anniversaries',
    'Holidays',
    'Promotions and Achievements',
    'Weddings',
    'Newborns',
    'Retirements',
    'Appreciation',
    'Get Well Soon',
    'Graduations',
    'Apologies',
    'Housewarmings',
    "Valentine's Day",
    'Thank You Gifts',
  ],
  relationship: ['Spouse or Significant Other', 'Girlfriend', 'Child', 'Parent', 'Grand Parent', 'Friend', 'Colleague'],
  style: [
    'Classic and Timeless',
    'Minimalistic',
    'Comfortable Yet Stylish',
    'Bougie',
    'Premium Brands',
    'Chill',
    'Practical',
  ],
  budget: ['< $200', '$200-$400', '$400-$600', '$600-$800', '$800-$1000', '$1000+'],
};

export const budgetMap = {
  '< $200': { min: 0, max: 200 },
  '$200-$400': { min: 200, max: 400 },
  '$400-$600': { min: 400, max: 600 },
  '$600-$800': { min: 600, max: 800 },
  '$800-$1000': { min: 800, max: 1000 },
  '$1000+': { min: 1000, max: Number.MAX_SAFE_INTEGER },
};

export const productPerPageAdmin = 12;

export const dummyProduct: Product = {
  source: 'amazon',
  views: 0,
  tags: [
    'Female',
    '25 - 45',
    '45 - 65',
    'Fashion and Accessories',
    'Jewelry',
    'Romantic',
    'Anniversaries',
    'Birthdays',
    "Valentine's Day",
    'Weddings',
    'Spouse or Significant Other',
    'Romantic',
    'Classic and Timeless',
  ],
  similarity: 39,
  rulebased_tags: [],
  gptTagging: [
    {
      gender: ['Female'],
      age_category: ['25 - 45', '45 - 65'],
      interest: ['Fashion and Accessories', 'Jewelry', 'Romantic'],
      occasion: ['Anniversaries', 'Birthdays', "Valentine's Day", 'Weddings'],
      relationship: ['Spouse or Significant Other'],
      style: ['Romantic', 'Classic and Timeless'],
    },
  ],
  hil: false,
  is_active: false,
  created_at: null,
  updated_at: null,
  title:
    'TRYNDI Necklace Gifts for Wife from Husband - Gift for Wife Anniversary Birthday Gift Ideas, Gift for Wife, Christmas, Valentines, Wedding Anniversary Romantic Gifts for Her',
  image: 'https://m.media-amazon.com/images/I/6181Ls1lFWL._AC_SY500_.jpg',
  link: 'https://www.amazon.com/TRYNDI-Necklace-Gifts-Wife-Husband/dp/B0BH36R7G5/ref=sr_1_31?keywords=gift%2Babove%2B%24100&qid=1706637028&refinements=p_36%3A10000-&rnid=386465011&sr=8-31&th=1',
  rating: 4.6,
  price: 12312,
  description:
    'tryndi necklace gifts for wife from husband  gift for wife anniversary birthday gift ideas gift for wife christmas valentines wedding anniversary romantic gifts for her go to your orders to start the return print the return shipping label ship it',
  id: '65b938a782c661c2f563261f',
  curated: true,
  price_currency: 'USD',
};

export const addNewProductSteps = ['Link', 'Product Info', 'Preview'];

export const bottomNavHidePaths = ['welcome', 'login', 'admin'];

export const getStartedChips = [
  'Discover gifts for your spouse',
  'Discover gifts for your mom',
  'Create a new giftee profile',
  'View existing giftee profiles',
  'Start shopping',
];

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

export const profileCardImages = {
  parent: '/_parent_.jpeg',
  wife: '/_wife_.jpeg',
  friend: '/_friend_.jpeg',
};
