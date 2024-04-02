import { Grid, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../../utils/theme';
import { FC, PropsWithChildren, useState } from 'react';
import { Tune } from '@mui/icons-material';
import { EditProfileModal } from '../../profile/EditProfileModal';


const MobileHeader = () => {
  const navigate = useNavigate();
  const [editProfileModalOpen, setEditProfileModalOpen] = useState<boolean>(false);
  const handleEditProfileModalClose = async () => {
    setEditProfileModalOpen(false);
  };
  
  return (
    <Grid
      container
      sx={{
        display: 'flex',
        width: '100%',
        alignSelf: 'flex-start',
        p: '20px',
        // flexDirection: 'column',
        // borderBottom: '1px solid rgba(221, 110, 63, 1)',
        position: 'fixed',
        top: 0,
        zIndex: 1000,
        justifyContent: 'space-between',
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
      {true && (
        <IconButton onClick={() => {setEditProfileModalOpen(true)}}>
          <Tune fontSize={'large'} />
        </IconButton>
      )}
      <EditProfileModal open={editProfileModalOpen} onClose={handleEditProfileModalClose} />
    </Grid>
  );
};

export const MobileLayout: FC<PropsWithChildren> = ({ children }) => {
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
      <Box sx={{ display: 'flex', flexGrow: 1, overflowY: 'auto', pb: '75px', marginTop: '85px' }}>{children}</Box>
    </Grid>
  );
};
