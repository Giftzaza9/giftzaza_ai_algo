import { useEffect } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { loginWithFacebook, loginWithGoogle } from '../../services/Auth';
import { toast } from 'react-toastify';
// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { userStore } from '../../store/UserStore';
import { useNavigate } from 'react-router-dom';

export const Auth = () => {
  const { setUser, user } = userStore;
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.name && localStorage.getItem("__giftzaza__")) {
      navigate('/');
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
      console.log('Logged in ', data);
      navigate('/');
    } else {
      console.log('ERROR ', error);
      toast.error(error);
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
    if (data) console.log('Logged in ', data);
    else {
      console.log('ERROR ', error);
      toast.error(error);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center', rowGap: 4, marginTop: '40px' }}
      >
        <img
          src={require('../../assets/giftzaza-logo.png')}
          alt="logo"
          style={{
            width: '150px',
            height: '55px',
          }}
        />
        <Typography variant="h6" fontWeight={'bold'} component="h1">
          Welcome! How do you want to get started?
        </Typography>
        <Button onClick={() => loginGoogle()} variant="contained" startIcon={<GoogleIcon />} sx={{ width: 'fit-content' }}>
          Sign in with Google
        </Button>
        <FacebookLogin
          appId={process.env.REACT_APP_FB_APP_ID as string}
          fields="name,email,picture"
          render={(renderProps) => (
            <Button
              onClick={renderProps.onClick}
              variant="contained"
              startIcon={<FacebookIcon />}
              sx={{ width: 'fit-content', marginTop: '-20px' }}
            >
              Sign in with Facebook
            </Button>
          )}
          callback={responseFacebook}
        />
      </Box>
    </Grid>
  );
};
