import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { GoHomeFill } from 'react-icons/go';
import { observer } from 'mobx-react-lite';
import { bottomNavState } from '../../../store/BottomNavState';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { iphoneSeCondition } from '../../../constants/constants';
import { theme } from '../../../utils/theme';
import { Bookmark } from '@mui/icons-material';

export const BottomNav = observer(() => {
  const isSmallScreen = useMediaQuery(iphoneSeCondition);
  const navigate = useNavigate();
  const { isVisible } = bottomNavState;
  const [value, setValue] = React.useState('home');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      sx={{
        display: isVisible ? { xs: 'flex' } : { xs: 'none' },
        position: 'fixed',
        bottom: 0,
        width: '100%',
        zIndex: 1000,
        height: '46px',
        backgroundColor: theme.palette.secondary.main,
        '& .Mui-selected': { color: 'rgba(221, 110, 63, 1)' },
      }}
    >
      <BottomNavigationAction
        value="home"
        icon={<GoHomeFill style={{ fontSize: isSmallScreen ? '22px' : '26px' }} />}
        onClick={() => navigate('/')}
      />
      <BottomNavigationAction
        value="profiles"
        icon={<GridViewRoundedIcon style={{ fontSize: isSmallScreen ? '22px' : '26px' }} />}
        onClick={() => navigate('/profiles')}
      />
      <BottomNavigationAction
        value="favorites"
        icon={<Bookmark style={{ fontSize: isSmallScreen ? '22px' : '26px' }} onClick={() => navigate('/saved')} />}
      />
      <BottomNavigationAction
        value="user"
        icon={<PersonRoundedIcon style={{ fontSize: isSmallScreen ? '22px' : '26px' }} />}
        onClick={() => navigate('/user')}
      />
    </BottomNavigation>
  );
});
