import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { observer } from 'mobx-react-lite';
import { bottomNavState } from '../../../store/BottomNavState';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { bottomNavIcons, iphoneSeCondition } from '../../../constants/constants';
import { theme } from '../../../utils/theme';
import { userStore } from '../../../store/UserStore';

const bottomNavStyles = {
  position: 'fixed',
  bottom: 0,
  width: '100%',
  zIndex: 1000,
  height: '46px',
  backgroundColor: theme.palette.secondary.main,
  '& .MuiBottomNavigationAction-root.Mui-selected': { color: 'rgba(221, 110, 63, 1)' },
};

export const BottomNav = observer(() => {
  const isSmallScreen = useMediaQuery(iphoneSeCondition);
  const navigate = useNavigate();
  const { isVisible } = bottomNavState;
  const { user } = userStore;
  const token = !!localStorage.getItem('access_giftalia');
  const [value, setValue] = React.useState('home');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    if (window.location.pathname === '/dashboard' || window.location.pathname.includes('create-profile')) setValue('home');
    if (window.location.pathname === '/dashboard/profiles' || window.location.pathname.includes('profiles'))
      setValue('profiles');
    if (window.location.pathname === '/dashboard/saved' || window.location.pathname.includes('saved')) setValue('saved');
    if (window.location.pathname === '/dashboard/user' || window.location.pathname.includes('user')) setValue('user');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      sx={{ ...bottomNavStyles, display: isVisible && user && token ? { xs: 'flex' } : { xs: 'none' } }}
    >
      {bottomNavIcons?.map(({ Icon, href, value }) => (
        <BottomNavigationAction
          value={value}
          icon={<Icon style={{ fontSize: isSmallScreen ? '22px' : '26px' }} />}
          onClick={() => navigate(href)}
        />
      ))}
    </BottomNavigation>
  );
});
