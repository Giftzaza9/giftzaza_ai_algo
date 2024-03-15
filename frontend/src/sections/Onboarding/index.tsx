import { Grid, Container, Typography, Box, Button } from '@mui/material';
import { theme } from '../../utils/theme';
import DoneIcon from '@mui/icons-material/Done';
import { userStore } from '../../store/UserStore';
import { useNavigate } from 'react-router-dom';
import { bottomNavState } from '../../store/BottomNavState';
import { observer } from 'mobx-react-lite';

const textColor = 'rgba(68, 65, 66, 1)';

const heading = {
  color: textColor,
  fontWeight: '700',
  fontSize: '16px',
  lineHeight: '22px',
  fontFamily: 'Inter',
  marginLeft: '10px',
};

const text = {
  color: textColor,
  fontWeight: '600',
  fontSize: '14px',
  lineHeight: '24px',
  fontFamily: 'Inter',
};

export const Onboarding = observer(() => {
  const { user } = userStore;
  const { setIsVisible } = bottomNavState;

  const navigate = useNavigate();

  return (
    <Grid container component="main" width={'lg'} sx={{ height: '100vh', backgroundColor: theme.palette.secondary.main }}>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          alignItems: 'center',
          rowGap: 4,
          textAlign: 'center',
          marginTop: '35%',
          marginBottom: '15%',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <Box>
            <Typography noWrap color={textColor} fontWeight={800} fontSize={'22px'} lineHeight={'26px'}>
              Welcome to Giftzaza, {user?.name?.split(' ')?.[0]}
            </Typography>
            <Typography sx={text} mt={1}>
              Please follow these House Rules.
            </Typography>
          </Box>
          <Box textAlign={'left'} width={'90%'} margin={'auto'} display={'flex'} flexDirection={'column'} rowGap={2} mt={4}>
            <Box>
              <Box display={'flex'}>
                <DoneIcon sx={{ color: 'rgba(221, 110, 63, 1)', fontSize: '16px' }} />
                <Typography sx={heading}>Play it cool.</Typography>
              </Box>
              <Typography sx={text}>Respect others and treat them as you would like to be treated.</Typography>
            </Box>
            <Box>
              <Box display={'flex'}>
                <DoneIcon sx={{ color: 'rgba(221, 110, 63, 1)', fontSize: '16px' }} />
                <Typography sx={heading}>Be proactive.</Typography>
              </Box>
              <Typography sx={text}>Always report bad behavior.</Typography>
            </Box>
          </Box>
        </Box>
        <Box width={'90%'}>
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: '100%' }}
            onClick={() => {
              setIsVisible(true);
              navigate('/');
            }}
          >
            I Agree
          </Button>
        </Box>
      </Container>
    </Grid>
  );
});
