import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { GoHomeFill } from 'react-icons/go';
import { userStore } from '../../../store/UserStore';
import { AdminPanelSettings } from '@mui/icons-material';
import { observer } from 'mobx-react-lite';
import { bottomNavState } from '../../../store/BottomNavState';

export const BottomNav = observer(() => {
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
        height: '75px',
      }}
    >
      <BottomNavigationAction label="Home" value="home" icon={<GoHomeFill style={{ fontSize: '36px' }} />} />
      <BottomNavigationAction
        label="Profiles"
        value="profiles"
        icon={<GridViewRoundedIcon style={{ fontSize: '36px' }} />}
      />
      <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon style={{ fontSize: '36px' }} />} />
      <BottomNavigationAction label="User" value="user" icon={<PersonRoundedIcon style={{ fontSize: '36px' }} />} />
      {user?.role === 'admin' && (
        <BottomNavigationAction
          label="Administration"
          value="administration"
          icon={<AdminPanelSettings style={{ fontSize: '36px' }} />}
        />
      )}
    </BottomNavigation>
  );
});
