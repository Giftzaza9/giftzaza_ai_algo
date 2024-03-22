import { observer } from 'mobx-react';
import { userStore } from '../../store/UserStore';
import { MobileLayout } from '../../components/shared/MobileLayout';
import { Avatar, Box, Button, Grid, TextField, Typography, useMediaQuery } from '@mui/material';
import { theme } from '../../utils/theme';
import { getVH, logOut, stringToColor } from '../../utils/helperFunctions';
import { bottomNavState } from '../../store/BottomNavState';
import { useNavigate } from 'react-router-dom';
import { FC } from 'react';
import { ArrowForwardIos } from '@mui/icons-material';

const containerStyles = {
  // height: '100vh',
  flexGrow: 1,
  backgroundColor: theme.palette.secondary.main,
  flexDirection: 'column',
  flexWrap: 'nowrap',
  gap: getVH(1),
};
const itemStyles = { display: 'flex', justifyContent: 'center', alignItems: 'center' };
const thumbContainerStyles = {
  borderRadius: '50%',
  border: '5px solid rgba(221, 110, 63, 1)',
  height: '160px',
  width: '160px',
};

interface _Props {
  value: string;
  label: string;
}

const StyledTextField: FC<_Props> = ({ label, value }) => {
  return (
    <TextField
      value={value}
      label={label}
      disabled
      fullWidth
      size="small"
      sx={{
        '& .MuiOutlinedInput-input': {
          fontSize: '18px',
          fontWeight: 700,
          fontFamily: 'Inter',
          color: 'black',
        },
        '& .Mui-disabled': {
          WebkitTextFillColor: 'black',
        },
      }}
    />
  );
};

export const User = observer(() => {
  const { user, setUser } = userStore;
  const { setIsVisible } = bottomNavState;
  const isSmallScreen = useMediaQuery('(max-height: 530px)');
  const navigate = useNavigate();
  return (
    <MobileLayout>
      <Grid container component="main" sx={containerStyles}>
        <Grid item sx={{ ...itemStyles, padding: isSmallScreen ? getVH(1) : getVH(4) }}>
          <Box sx={{ ...thumbContainerStyles, height: getVH(20), width: getVH(20) }}>
            {user?.profile_picture ? (
              <Avatar sx={{ height: '100%', width: '100%' }} src={user?.profile_picture} />
            ) : (
              <Avatar
                sx={{ bgcolor: stringToColor(user?.name as string), height: '100%', width: '100%', fontSize: getVH(6) }}
              >
                {`${user?.name?.split(' ')?.[0]?.[0] || ''} ${user?.name?.split(' ')?.[1]?.[0] || ''}` || user?.name?.[0]}
              </Avatar>
            )}
          </Box>
        </Grid>

        <Grid item sx={{ ...itemStyles, flexDirection: 'column', paddingX: '14px', gap: '14px' }}>
          <StyledTextField value={user?.name?.split(' ')?.[0] as string} label={`First Name`} />
          <StyledTextField value={user?.name?.split(' ')?.[1] as string} label={`Last Name`} />
          <StyledTextField value={user?.email as string} label={`Email`} />
        </Grid>

        <Grid item sx={{ ...itemStyles, flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          <Box flexGrow={1}></Box>
          <Box width={'75%'} sx={{ paddingBottom: isSmallScreen ? '0px' : getVH(6) }}>
            {user?.role === 'admin' && (
              <Button
                variant="contained"
                color="secondary"
                sx={{ width: '100%', padding: '6px 18px', mb: '12px' }}
                LinkComponent={'a'}
                href="/dashboard/admin"
                target="_blank"
                endIcon={<ArrowForwardIos fontSize="small" />}
                size="small"
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontFamily: 'Inter',
                    color: 'white',
                    fontSize: isSmallScreen ? getVH(3) : '16px',
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  Admin Panel
                </Typography>
              </Button>
            )}
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: '100%', padding: '6px 18px' }}
              onClick={() => {
                setUser(undefined);
                setIsVisible(false);
                logOut();
                navigate('/login');
              }}
              size="small"
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontFamily: 'Inter',
                  color: 'white',
                  fontSize: isSmallScreen ? getVH(3) : '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Logout
              </Typography>
            </Button>
          </Box>
        </Grid>
      </Grid>
    </MobileLayout>
  );
});
