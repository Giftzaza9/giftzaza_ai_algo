import { useEffect } from 'react';
import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { loginWithFacebook, loginWithGoogle } from '../../services/auth';
import { toast } from 'react-toastify';
// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
// import GoogleIcon from '@mui/icons-material/Google';
// import FacebookIcon from '@mui/icons-material/Facebook';
import { userStore } from '../../store/UserStore';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../utils/theme';
import { observer } from 'mobx-react-lite';
import { bottomNavState } from '../../store/BottomNavState';

export const Auth = observer(() => {
  const { setUser, user } = userStore;
  const { setIsVisible } = bottomNavState;
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.name && localStorage.getItem('access_giftalia')) {
      // navigate('/');
    }
  }, [navigate, user]);

  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      googleLogin(tokenResponse);
    },
  });

  const googleLogin = async (tokenResponse: any) => {
    if (!tokenResponse) return;
    const payload = {
      token: tokenResponse?.access_token,
    };
    const { data, error } = await loginWithGoogle(payload);
    if (data) {
      setUser(data?.user);
      setIsVisible(false);
      navigate('/welcome');
    } else {
      console.log('ERROR ', error);
      toast.error(error?.message as string);
    }
  };

  const responseFacebook = async (response: any) => {
    console.log(response);
    if (response?.status === 'unknown') return;
    const payload = {
      name: response?.name,
      email: response?.email,
    };
    const { data, error } = await loginWithFacebook(payload);
    if (data) {
      setUser(data?.user);
      setIsVisible(false);
      navigate('/welcome');
    } else {
      console.log('ERROR ', error);
      toast.error(error?.message as string);
    }
  };

  return (
    <Grid
      container
      className="full-screen"
      component="main"
      width={'lg'}
      sx={{ backgroundColor: theme.palette.secondary.main }}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          alignItems: 'center',
          rowGap: 4,
          textAlign: 'center',
          justifyContent: 'flex-end',
          marginBottom: 'calc(var(--vh) * 7)',
        }}
      >
        <Stack position={'relative'} alignItems={'center'}>
          <img
            src={require('../../assets/logo_gift.png')}
            alt="logo"
            style={{
              width: '100px',
              height: '100px',
            }}
          />
          <img
            src={require('../../assets/giftzaza-logo.png')}
            alt="logo"
            style={{
              width: '260px',
              // height: '55px',
            }}
          />
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontWeight: '500',
              fontSize: '10px',
              lineHeight: '12.1px',
              position: 'absolute',
              bottom: '4px',
              right: '4px',
            }}
          >
            YOUR PERSONAL AI GIFTING ASSISTANT
          </Typography>
        </Stack>
        <Typography fontWeight={'500'} fontSize={'12px'} color={'black'}>
          By tapping Create Account or Sign In, you agree to our Terms. Learn how we process your data in our Privacy Policy
          and Cookies Policy.
        </Typography>
        <Button
          onClick={() => loginGoogle()}
          variant="contained"
          color="secondary"
          // startIcon={<GoogleIcon />}
          sx={{ width: '100%' }}
        >
          Sign in with Google
        </Button>
        <FacebookLogin
          appId={process.env.REACT_APP_FB_APP_ID as string}
          fields="name,email,picture"
          render={(renderProps) => (
            <Button
              onClick={renderProps.onClick}
              variant="outlined"
              color="secondary"
              // startIcon={<FacebookIcon />}
              sx={{ width: '100%', marginTop: '-20px' }}
            >
              Sign in with Facebook
            </Button>
          )}
          callback={responseFacebook}
        />
        <Button variant="text">
          <Typography fontWeight={'500'} fontSize={'14.11px'} color={'black'} component={'a'} href="mailto:giftzaza108@gmail.com?subject=Trouble Signing In&body=Hi, I'm unable to signing in Giftalia !!">
            Trouble Signing In ?
          </Typography>
        </Button>
      </Container>
    </Grid>
  );
});
