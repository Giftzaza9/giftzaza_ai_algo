import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { GoHomeFill } from 'react-icons/go';
import { userStore } from '../../../store/UserStore';
// import { AdminPanelSettings } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { bottomNavState } from '../../../store/BottomNavState';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { iphoneSeCondition } from '../../../constants/constants';
import { theme } from '../../../utils/theme';

export const BottomNav = observer(() => {
  const isSmallScreen = useMediaQuery(iphoneSeCondition);
  const navigate = useNavigate();
  const { isVisible } = bottomNavState;
  const { user } = userStore;
  const [value, setValue] = React.useState('home');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      sx={{
        display:
          user?.role === 'admin' && isVisible
            ? { xs: 'flex', md: 'none' }
            : user?.role === 'user' && isVisible
            ? { xs: 'flex' }
            : { xs: 'none' },
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 1000,
        height: isSmallScreen ? '50px' : '60px',
        backgroundColor: theme.palette.secondary.main,
        '& .Mui-selected': { color: 'rgba(221, 110, 63, 1)' },
      }}
    >
      <BottomNavigationAction
        value="home"
        icon={<GoHomeFill style={{ fontSize: isSmallScreen ? '24px' : '36px' }} />}
        onClick={() => navigate('/')}
      />
      <BottomNavigationAction
        value="profiles"
        icon={<GridViewRoundedIcon style={{ fontSize: isSmallScreen ? '24px' : '36px' }} />}
        onClick={() => navigate('/profiles')}
      />
      <BottomNavigationAction
        value="favorites"
        icon={<FavoriteIcon style={{ fontSize: isSmallScreen ? '24px' : '36px' }} />}
      />
      <BottomNavigationAction
        value="user"
        icon={<PersonRoundedIcon style={{ fontSize: isSmallScreen ? '24px' : '36px' }} />}
        onClick={() => navigate('/user')}
      />
    </BottomNavigation>
  );
});
