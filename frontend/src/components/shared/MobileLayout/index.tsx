import { Grid, IconButton, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../../utils/theme';
import { FC, PropsWithChildren, useState } from 'react';
import { Tune } from '@mui/icons-material';
import { EditProfileModal } from '../../profile/EditProfileModal';
import { Profile } from '../../../constants/types';
import { iphoneSeCondition } from '../../../constants/constants';

interface _Props {
  fetchProfile?: () => Promise<void>;
  profile?: Profile;
}

const MobileHeader: FC<_Props> = ({ profile, fetchProfile }) => {
  const isSmallScreen = useMediaQuery(iphoneSeCondition);
  const navigate = useNavigate();
  const [editProfileModalOpen, setEditProfileModalOpen] = useState<boolean>(false);
  const [profileToUpdate, setProfileToUpdate] = useState<Profile | undefined>();

  const handleEditProfileModalClose = async (refetch?: boolean) => {
    setProfileToUpdate(undefined);
    setEditProfileModalOpen(false);
    if (refetch && typeof fetchProfile === 'function') {
      await fetchProfile();
    }
  };

  return (
    <Grid
      container
      sx={{
        display: 'flex',
        width: '100%',
        alignSelf: 'flex-start',
        px: '20px',
        py: isSmallScreen ? '10px' : '20px',
        backgroundColor: theme.palette.secondary.main,
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
          width: isSmallScreen ? '80px' : '100px',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      />
      {profile && (
        <IconButton
          onClick={() => {
            setProfileToUpdate(profile);
            setEditProfileModalOpen(true);
          }}
        >
          <Tune fontSize={'large'} />
        </IconButton>
      )}
      <EditProfileModal profile={profileToUpdate!} open={editProfileModalOpen} onClose={handleEditProfileModalClose} />
    </Grid>
  );
};

interface Props extends PropsWithChildren {
  fetchProfile?: () => Promise<void>;
  profile?: Profile;
}

export const MobileLayout: FC<Props> = ({ children, profile, fetchProfile }) => {
  const isSmallScreen = useMediaQuery(iphoneSeCondition);
  return (
    <Grid
      container
      component="main"
      sx={{
        backgroundColor: theme.palette.secondary.main,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'relative',
      }}
    >
      <MobileHeader profile={profile} fetchProfile={fetchProfile} />
      <Box sx={{ display: 'flex', flexGrow: 1, overflowY: 'auto', pb:  isSmallScreen ? '50px' : '60px', marginTop:  isSmallScreen ? '50px' : '76px', flexDirection: 'column' }}>{children}</Box>
    </Grid>
  );
};
