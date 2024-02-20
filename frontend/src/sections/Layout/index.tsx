import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { userStore } from '../../store/UserStore';
import { logOut, stringAvatar } from '../../utils/shared/Common';
import { useLocation, useNavigate } from 'react-router-dom';

const iconStyle = {
  fontSize: 'large',
  marginBottom: '-3px',
  marginRight: '4px',
};

// const pages = ['Profile', 'Administration', 'Loved'];
// const pagesIcon = [<PersonOutlineIcon sx={iconStyle} />, <DescriptionOutlinedIcon sx={iconStyle} />, <FavoriteBorderIcon sx={iconStyle} />];
const links = [
  { name: 'Profile', link: '/', icon: <PersonOutlineIcon sx={iconStyle} /> },
  { name: 'Administration', link: '/admin', icon: <DescriptionOutlinedIcon sx={iconStyle} /> },
  { name: 'Loved', link: '/loved', icon: <FavoriteBorderIcon sx={iconStyle} /> },
];
const settings = ['Logout'];

function Header({ children }: any) {
  const { user } = userStore;
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const location = useLocation();
  const activeLink = location?.pathname?.substring(
    location?.pathname?.lastIndexOf("/") + 1
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProfileMenu = (action: any) => {
    console.log(action);
    if (action === 'Logout') {
      logOut();
      navigate('/login');
    }
    handleCloseNavMenu();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <AppBar position="static" sx={{ background: 'white', boxShadow: 'none' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex', color: "black" }, mr: 1 }} /> */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <img
                src={require('../../assets/giftzaza-logo.png')}
                alt="logo"
                style={{
                  width: '100px',
                  height: '36px',
                  marginRight: 40,
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/')}
              />
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="default"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {links.map((item, index) => (
                  <MenuItem key={item?.name + '-' + index} onClick={() => navigate(item?.link)}>
                    {item?.icon}
                    <Typography textAlign="center" sx={{ fontSize: 'medium', color: '#dfc9ea' }}>
                      {item?.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none', color: "black" }, mr: 1 }} /> */}
            {/* <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'black',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography> */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 2, flexGrow: 1 }}>
              <img
                src={require('../../assets/giftzaza-logo.png')}
                alt="logo"
                style={{
                  width: '100px',
                  height: '36px',
                  marginRight: 40,
                  cursor: 'pointer',
                }}
                onClick={() => navigate('/')}
              />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {links.map((item, index) => (
                <Button
                  key={index + '--' + item?.name}
                  onClick={() => navigate(item?.link)}
                  sx={{
                    my: 3,
                    mx: 1,
                    display: 'block',
                    textTransform: 'unset',
                    fontSize: 'medium',
                    color: '#rgb(132, 64, 165)',
                    fontWeight: activeLink === item?.link ? "600" : "none"
                  }}
                >
                  {item?.icon}
                  {item?.name}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={user?.name}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar {...stringAvatar(user?.name || '')} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleProfileMenu(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
}
export default Header;
