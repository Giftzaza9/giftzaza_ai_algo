import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../../utils/theme';
import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { Close, IosShare, Tune } from '@mui/icons-material';
import { EditProfileModal } from '../../profile/EditProfileModal';
import { Profile } from '../../../constants/types';
import { iphoneSeCondition } from '../../../constants/constants';
import { observer } from 'mobx-react-lite';
import { loaderState } from '../../../store/ShowLoader';
import { ErrorBoundary } from 'react-error-boundary';
import { CreateProfile } from '../../../sections/Profiles/CreateProfile';
import { showInstallBannerState } from '../../../store/ShowInstallBanner';
import { pwaPromptOpenState } from '../../../store/PwaPropmtOpen';

interface _Props {
  fetchProfile?: () => void;
  profile?: Profile;
  bannerVisible?: boolean;
  setBannerVisible?: (v: boolean) => void;
  setPwaPromptOpen?: (v: boolean) => void;
}

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any)?.MSStream;

const MobileHeader: FC<_Props> = ({ profile, fetchProfile, bannerVisible, setBannerVisible, setPwaPromptOpen }) => {
  const isSmallScreen = useMediaQuery(iphoneSeCondition);
  const navigate = useNavigate();
  const [editProfileModalOpen, setEditProfileModalOpen] = useState<boolean>(false);
  const [IosInstallBannerOpen, setIosInstallBannerOpen] = useState<boolean>(false);
  const [profileToUpdate, setProfileToUpdate] = useState<Profile | undefined>();

  const handleEditProfileModalClose = async (refetch?: boolean) => {
    setProfileToUpdate(undefined);
    setEditProfileModalOpen(false);
    if (refetch && typeof fetchProfile === 'function') {
      fetchProfile();
    }
  };

  const handleBannerClick = () => {
    if (isIOS) setIosInstallBannerOpen(true);
    else setPwaPromptOpen && setPwaPromptOpen(true);
  };

  return !bannerVisible ? (
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
        alignItems: 'center',
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
  ) : (
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
        alignItems: 'center',
      }}
    >
      <Box display={'flex'} alignItems={'center'} justifyContent={'center'} gap={'3px'} onClick={() => navigate('/')}>
        <img
          src={require('../../../assets/logo_gift.png')}
          alt="logo"
          style={{
            height: isSmallScreen ? '20px' : '22px',
            cursor: 'pointer',
            alignSelf: 'baseline',
          }}
        />
      </Box>

      <Box display={'flex'} alignItems={'center'} gap={'12px'}>
        {/* {isIOS ? ( */}
        <Box display={'flex'} alignItems={'center'} gap={'12px'}>
          <Typography
            sx={{
              fontSize: '18px',
              fontFamily: 'Inter',
              fontWeight: 500,
              textTransform: 'none',
            }}
          >
            Open Giftalia App
          </Typography>

          <Button
            size="small"
            sx={{
              cursor: 'pointer',
              bgcolor: 'rgba(221, 110, 63, 1)',
              color: 'white',
              fontSize: '18px',
              fontFamily: 'Inter',
              fontWeight: '600',
              padding: '4px 14px!important',
            }}
            onClick={() => {
              handleBannerClick();
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                fontFamily: 'Inter',
                fontWeight: 500,
                textTransform: 'none',
              }}
            >
              Install
            </Typography>
          </Button>

          <Dialog
            open={IosInstallBannerOpen}
            onClose={() => {
              setIosInstallBannerOpen(false);
            }}
          >
            <DialogTitle>Install Giftalia App</DialogTitle>

            <DialogContent>
              <Typography
                sx={{
                  fontSize: '14px',
                  fontFamily: 'Inter',
                  fontWeight: 400,
                  textTransform: 'none',
                  mb: '16px',
                }}
              >
                Tap on <IosShare /> and select <strong>Add to Home Screen</strong>.{' '}
              </Typography>
              <DialogContentText>
                Install the app on your device to easily access it any time. No app store. No download. No hassle.
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </Box>

        <IconButton
          onClick={() => {
            setBannerVisible && setBannerVisible(false);
          }}
          size="small"
          sx={{ p: 0 }}
        >
          <Close fontSize={'small'} />
        </IconButton>
      </Box>

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
      // alert(error.message || 'Something went wrong!');
      console.log(error.message);
      window.location.href = '/';
    }
  }, [error]);

  return <CreateProfile />;
}

export const MobileLayout = observer(({ children, profile, fetchProfile }: Props) => {
  const isSmallScreen = useMediaQuery(iphoneSeCondition);
  const { loading, setLoading } = loaderState;
  const { setVisible, visible } = showInstallBannerState;
  const { setPwaPromptOpen } = pwaPromptOpenState;
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
        <MobileHeader
          profile={profile}
          fetchProfile={fetchProfile}
          bannerVisible={visible}
          setBannerVisible={setVisible}
          setPwaPromptOpen={setPwaPromptOpen}
        />
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
