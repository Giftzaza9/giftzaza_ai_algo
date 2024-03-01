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
  gender: [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ],
  age_category: [
    { label: 'Under 12', value: 'under-12' },
    { label: '12 - 18', value: '12-18' },
    { label: '18 - 25', value: '18-25' },
    { label: '25 - 45', value: '25-45' },
    { label: '45 - 65', value: '45-65' },
    { label: '65 +', value: '65+' },
  ],
  interest: [
    { label: 'Fitness and Wellness', value: 'fitness,wellness' },
    { label: 'Tech and Gadgets', value: 'tech,gadgets' },
    { label: 'Fashion and Accessories', value: 'fashion,accessories' },
    { label: 'Books and Learning', value: 'books,learning' },
    { label: 'Travel and Adventure', value: 'travel,adventure' },
    { label: 'Food and Cooking', value: 'food,cooking' },
    { label: 'Arts and Crafts', value: 'arts,crafts' },
    { label: 'Music and Entertainment', value: 'music,entertainment' },
    { label: 'Outdoor and Nature', value: 'outdoor,nature' },
    { label: 'Beauty and Self-Care', value: 'beauty,self-care' },
    { label: 'Home and Decor', value: 'home,decor' },
    { label: 'Sports and Hobbies', value: 'sports,hobbies' },
    { label: 'Pets and Animal Lovers', value: 'pets,animal' },
    { label: 'Art and Culture', value: 'art,culture' },
    { label: 'Social Impact and Charity', value: 'social-impact,charity' },
    { label: 'Spirituality', value: 'spirituality' },
  ],
  occasion: [
    { label: 'Birthdays', value: 'birthdays' },
    { label: 'Anniversaries', value: 'anniversaries' },
    { label: 'Holidays', value: 'holidays' },
    { label: 'Promotions and Achievements', value: 'promotions-and-achievements' },
    { label: 'Weddings', value: 'weddings' },
    { label: 'Newborns', value: 'newborns' },
    { label: 'Retirements', value: 'retirements' },
    { label: 'Housewarmings', value: 'housewarmings' },
    { label: 'Graduations', value: 'graduations' },
    { label: "Valentine's Day", value: 'valentines-day' },
    { label: 'Appreciation', value: 'appreciation' },
    { label: 'Get Well Soon', value: 'get-well-soon' },
    { label: 'Thank You Gifts', value: 'thank-you-gifts' },
    { label: 'Apologies', value: 'apologies' },
  ],
  relationship: [
    { label: 'Spouse or Significant Other', value: 'spouse-or-significant-other' },
    { label: 'Girlfriend', value: 'girlfriend' },
    { label: 'Child', value: 'child' },
    { label: 'Parent', value: 'parent' },
    { label: 'Grand Parent', value: 'grand-parent' },
    { label: 'Friend', value: 'friend' },
    { label: 'Colleague', value: 'colleague' },
  ],
  style: [
    { label: 'Classic and Timeless', value: 'classic-and-timeless' },
    { label: 'Comfortable Yet Stylish', value: 'comfortable-yet-stylish' },
    { label: 'Premium Brands', value: 'premium-brands' },
    { label: 'Minimalistic', value: 'minimalistic' },
    { label: 'Practical', value: 'practical' },
    { label: 'Chill', value: 'chill' },
    { label: 'Bougie', value: 'bougie' },
  ],
};

export const productPerPageAdmin = 12;
