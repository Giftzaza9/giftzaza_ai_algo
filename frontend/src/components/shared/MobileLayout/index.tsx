import { Grid } from '@mui/material';
import { Box, Container } from '@mui/system';
import { theme } from '../../../utils/theme';
import { useNavigate } from 'react-router-dom';

const MobileHeader = () => {
  const navigate = useNavigate();
  return (
    <Grid
      container
      sx={{
        display: 'flex',
        width: '100%',
        alignSelf: 'flex-start',
        p: '20px',
        flexDirection: 'column',
        borderBottom: '1px solid rgba(221, 110, 63, 1)',
        position: 'fixed',
        top: 0,
        zIndex: 1000,
      }}
    >
      <img
        src={require('../../../assets/giftzaza-logo.png')}
        alt="logo"
        style={{
          width: '150px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      />
    </Grid>
  );
};

export const MobileLayout = ({ children }: any) => {
  return (
    <Grid
      container
      component="main"
      sx={{
        backgroundColor: theme.palette.secondary.main,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <MobileHeader />
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pb: '56px', marginTop: '100px' }}>{children}</Box>
    </Grid>
  );
};
