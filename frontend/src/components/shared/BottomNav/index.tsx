import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { observer } from 'mobx-react-lite';
import { bottomNavState } from '../../../store/BottomNavState';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';
import { bottomNavIcons, iphoneSeCondition } from '../../../constants/constants';
import { theme } from '../../../utils/theme';

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
  const [value, setValue] = React.useState('home');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      sx={{ ...bottomNavStyles, display: isVisible ? { xs: 'flex' } : { xs: 'none' } }}
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
