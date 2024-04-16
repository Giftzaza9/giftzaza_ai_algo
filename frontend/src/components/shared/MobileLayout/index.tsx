import { Backdrop, CircularProgress, Grid, IconButton, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../../utils/theme';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Tune } from '@mui/icons-material';
import { EditProfileModal } from '../../profile/EditProfileModal';
import { Profile } from '../../../constants/types';
import { iphoneSeCondition } from '../../../constants/constants';
import { observer } from 'mobx-react-lite';
import { loaderState } from '../../../store/ShowLoader';
import { ErrorBoundary } from 'react-error-boundary';
import { CreateProfile } from '../../../sections/Profiles/CreateProfile';

interface _Props {
  fetchProfile?: () => void;
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
      fetchProfile();
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
        zIndex: 100,
        justifyContent: 'space-between',
      }}
    >
      <Box display={'flex'} alignItems={'center'} gap={'3px'} onClick={() => navigate('/')}>
        <img
          src={require('../../../assets/logo_gift.png')}
          alt="logo"
          style={{
            height: isSmallScreen ? '20px' : '22px',
            cursor: 'pointer',
            alignSelf: 'baseline',
          }}
        />
        <img
          src={require('../../../assets/giftzaza-logo.png')}
          alt="logo"
          style={{
            width: isSmallScreen ? '70px' : '80px',
            cursor: 'pointer',
          }}
        />
      </Box>
      {profile && (
        <IconButton
          onClick={() => {
            setProfileToUpdate(profile);
            setEditProfileModalOpen(true);
          }}
          size="small"
          sx={{ p: 0 }}
        >
          <Tune fontSize={'large'} />
        </IconButton>
      )}
      <EditProfileModal profile={profileToUpdate!} open={editProfileModalOpen} onClose={handleEditProfileModalClose} />
    </Grid>
  );
};

interface Props extends PropsWithChildren {
  fetchProfile?: () => void;
  profile?: Profile;
}

function Fallback({ error, resetErrorBoundary }: any) {
  useEffect(() => {
    if (error) {
      alert(error.message || 'Something went wrong!');
      window.location.href = '/';
    }
  }, [error]);

  return <CreateProfile />;
}

export const MobileLayout = observer(({ children, profile, fetchProfile }: Props) => {
  const isSmallScreen = useMediaQuery(iphoneSeCondition);
  const { loading, setLoading } = loaderState;
  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Grid
        container
        component="main"
        className={'full-screen'}
        sx={{
          backgroundColor: theme.palette.secondary.main,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <MobileHeader profile={profile} fetchProfile={fetchProfile} />
        <Box
          sx={{
            display: 'flex',
            flexGrow: 1,
            overflowY: 'auto',
            pb: isSmallScreen ? '50px' : '60px',
            marginTop: isSmallScreen ? '50px' : '76px',
            flexDirection: 'column',
          }}
        >
          {children}
        </Box>
        <Backdrop
          sx={{ color: '#fff', zIndex: 9999 }}
          open={loading}
          onClick={() => {
            setLoading(false);
          }}
        >
          <CircularProgress
            sx={{
              width: '150px!important',
              height: '150px!important',
              color: 'rgba(221, 110, 63, 1)',
              alignSelf: 'center',
              margin: '20px auto',
            }}
          />
        </Backdrop>
      </Grid>
    </ErrorBoundary>
  );
});
