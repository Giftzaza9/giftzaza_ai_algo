import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { GoHomeFill } from 'react-icons/go';

export default function BottomNav() {
  const [value, setValue] = React.useState('recents');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      value={value}
      onChange={handleChange}
      sx={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000, height: '75px' }}
    >
      <BottomNavigationAction label="Home" value="home" icon={<GoHomeFill style={{ fontSize: '36px' }} />} />
      <BottomNavigationAction label="Profiles" value="profiles" icon={<GridViewRoundedIcon style={{ fontSize: '36px' }} />} />
      <BottomNavigationAction label="Favorites" value="favorites" icon={<FavoriteIcon style={{ fontSize: '36px' }} />} />
      <BottomNavigationAction label="User" value="user" icon={<PersonRoundedIcon style={{ fontSize: '36px' }} />} />
    </BottomNavigation>
  );
}
