import { Delete } from '@mui/icons-material';
import { Grid, Stack, Box, Typography, IconButton } from '@mui/material';
import { EditProfile } from '../shared/Icons/EditProfile';
import { Profile } from '../../constants/types';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { comingUpOn } from '../../utils/helperFunctions';

interface Props {
  profile: Profile;
  onEditProfile: (profile: Profile) => void;
  onDeleteProfile: (id: string) => void;
}

export const ProfileCard: FC<Props> = ({ profile, onEditProfile, onDeleteProfile }) => {
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
        <Stack sx={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <Stack flexDirection={'row'} gap={'4px'}>
            <IconButton
              sx={{ bgcolor: '#F7E38D' }}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteProfile(profile?.id);
              }}
            >
              <Delete sx={{ height: '12px', width: '12px', color: '#660985' }} />
            </IconButton>
            <IconButton
              sx={{ bgcolor: '#F7E38D' }}
              onClick={(e) => {
                e.stopPropagation();
                onEditProfile(profile);
              }}
            >
              <EditProfile />
            </IconButton>
          </Stack>
        </Stack>

        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontSize: '24px',
            fontFamily: 'Inter',
            lineHeight: '24px',
            fontWeight: 600,
            maxWidth: '100%',
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            WebkitLineClamp: 4,
          }}
        >
          {profile?.title}
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
            {profile?.occasion_date ? comingUpOn(profile?.occasion_date) : ''}
          </Typography>
        </Box>
      </Stack>
    </Grid>
  );
};
