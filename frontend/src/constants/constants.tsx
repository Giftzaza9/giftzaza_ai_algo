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
    { name: 'Profiles', link: '/profiles', icon: <PersonOutlineIcon sx={iconStyle} />, access: [roleEnum.ADMIN, roleEnum.USER] },
    { name: 'Administration', link: '/admin', icon: <DescriptionOutlinedIcon sx={iconStyle} />,  access: [roleEnum.ADMIN] },
    { name: 'Loved', link: '/loved', icon: <FavoriteBorderIcon sx={iconStyle} />,  access: [roleEnum.ADMIN, roleEnum.USER] },
  ];
export const navbarSettings = ['Logout'];