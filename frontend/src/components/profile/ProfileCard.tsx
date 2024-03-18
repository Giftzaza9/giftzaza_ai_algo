import { AccessTimeFilled } from '@mui/icons-material';
import { Grid, Stack, Box, Typography, IconButton } from '@mui/material';
import { EditProfile } from '../shared/Icons/EditProfile';
import { Profile } from '../../constants/types';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { comingUpOn, daysRemaining, ellipsisText } from '../../utils/helperFunctions';

interface Props {
  profile: Profile;
  handleProfileToEdit: (profile: Profile) => void;
}

export const ProfileCard: FC<Props> = ({ profile, handleProfileToEdit }) => {
  const navigate = useNavigate();
  return (
    <Grid
      item
      xs={5.9}
      sm={3.8}
      md={2.7}
      lg={1.8}
      sx={{
        width: '45vw',
        height: '28vh',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
        backgroundColor: 'white',
        borderRadius: '12px',
        backgroundImage: `url("${
          profile?.relation === 'Parent'
            ? require('../../assets/_parent_.jpeg')
            : profile?.relation === 'Friend'
            ? require('../../assets/_friend_.jpeg')
            : profile?.relation === 'Spouse or Significant Other'
            ? require('../../assets/_wife_.jpeg')
            : require('../../assets/_wife_.jpeg')
        }")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={() => {
        navigate(`/profiles/${profile?.id}`);
      }}
    >
      <Stack
        sx={{
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          background: 'linear-gradient(151.07deg, #ffceac9e 4.06%, rgb(0 0 0 / 56%) 86.74%)',
          p: '8px',
        }}
      >
        {/* Header */}
        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              borderRadius: '67px',
              bgcolor: '#D54747',
              p: '2px 6px',
            }}
            display={'inline-flex'}
            alignItems={'center'}
          >
            <AccessTimeFilled sx={{ color: 'white', fontSize: '12px' }} />
            <Typography
              variant="caption"
              sx={{ color: 'white', fontSize: '8px', fontFamily: 'Inter', lineHeight: '16px', fontWeight: 600 }}
            >
              {daysRemaining(profile?.occasion_date)}
            </Typography>
          </Box>

          <IconButton
            sx={{ bgcolor: '#F7E38D' }}
            onClick={(e) => {
              e.stopPropagation();
              handleProfileToEdit(profile);
            }}
          >
            <EditProfile />
          </IconButton>
        </Stack>

        <Typography
          variant="h5"
          sx={{ color: 'white', fontSize: '24px', fontFamily: 'Inter', lineHeight: '24px', fontWeight: 600 }}
        >
          {ellipsisText(profile?.title, 64)}
        </Typography>

        <Box>
          <Typography
            variant="h6"
            sx={{ color: 'white', fontSize: '14px', fontFamily: 'Inter', lineHeight: '16px', fontWeight: 700 }}
          >
            {profile?.occasion}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: 'white', fontSize: '10px', fontFamily: 'Inter', lineHeight: '16px', fontWeight: 700 }}
          >
            {comingUpOn(profile?.occasion_date)}
          </Typography>
        </Box>
      </Stack>
    </Grid>
  );
};
