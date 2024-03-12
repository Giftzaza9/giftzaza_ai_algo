import { Grid, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../../utils/theme';
import { Dispatch, FC, PropsWithChildren, SetStateAction, useState } from 'react';
import { Tune } from '@mui/icons-material';
import { EditProfileModal } from '../../profile/EditProfileModal';
import { Profile } from '../../../constants/types';

interface _Props {
  setProfile?: Dispatch<SetStateAction<Profile | undefined>>
  profile?: Profile;
}

const MobileHeader: FC<_Props> = ({ profile, setProfile }) => {
  const navigate = useNavigate();
  const [editProfileModalOpen, setEditProfileModalOpen] = useState<boolean>(false);
  const [profileToUpdate, setProfileToUpdate] = useState<Profile | undefined>();
  
  const handleEditProfileModalClose = async () => {
    setProfileToUpdate(undefined);
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
        backgroundColor: theme.palette.secondary.main ,
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
      <EditProfileModal setProfile={setProfile!} profile={profileToUpdate!} open={editProfileModalOpen} onClose={handleEditProfileModalClose} />
    </Grid>
  );
};

interface Props extends PropsWithChildren {
  setProfile?: Dispatch<SetStateAction<Profile | undefined>>
  profile?: Profile;
}

export const MobileLayout: FC<Props> = ({ children, profile, setProfile }) => {
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
      <MobileHeader profile={profile} setProfile={setProfile} />
      <Box sx={{ display: 'flex', flexGrow: 1, overflowY: 'auto', pb: '75px', marginTop: '85px' }}>{children}</Box>
    </Grid>
  );
};
