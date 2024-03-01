import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { roleEnum } from './types';

const iconStyle = {
  fontSize: 'large',
  marginBottom: '-3px',
  marginRight: '4px',
};

export const navbarLinks = [
  {
    name: 'Profiles',
    link: '/profiles',
    icon: <PersonOutlineIcon sx={iconStyle} />,
    access: [roleEnum.ADMIN, roleEnum.USER],
  },
  { name: 'Administration', link: '/admin', icon: <DescriptionOutlinedIcon sx={iconStyle} />, access: [roleEnum.ADMIN] },
  { name: 'Loved', link: '/loved', icon: <FavoriteBorderIcon sx={iconStyle} />, access: [roleEnum.ADMIN, roleEnum.USER] },
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
    'Housewarmings',
    'Graduations',
    "Valentine's Day",
    'Appreciation',
    'Get Well Soon',
    'Thank You Gifts',
    'Apologies',
  ],
  relationship: ['Spouse or Significant Other', 'Girlfriend', 'Child', 'Parent', 'Grand Parent', 'Friend', 'Colleague'],
  style: [
    'Classic and Timeless',
    'Comfortable Yet Stylish',
    'Premium Brands',
    'Minimalistic',
    'Practical',
    'Chill',
    'Bougie',
  ],
};

export const productPerPageAdmin = 12;
