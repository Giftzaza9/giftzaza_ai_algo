import { Box, Chip, Container, Grid, Typography } from '@mui/material';
import { MobileLayout } from '../../components/shared/MobileLayout';
import { useEffect, useState } from 'react';
import { Profile } from '../../constants/types';
import { getProfiles } from '../../services/profile';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const startedChipsStyle = {
  padding: '32px 15px',
  borderRadius: '32px',
  backgroundColor: 'white',
  color: 'rgba(0, 0, 0, 1)',
  fontSize: '18px',
  fontWeight: '600',
  fontFamily: 'Inter',
  cursor: 'pointer',
  width: '-webkit-fill-available',
  justifyContent: 'flex-start',
  '&:hover': {
    backgroundColor: 'rgba(221, 110, 63, 1)!important',
    color: 'white',
  },
  '&:active': {
    backgroundColor: 'rgba(221, 110, 63, 1)!important',
    color: 'white',
  },
};

export const ProfilesList = () => {

  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([])

  useEffect(() => {
    fetchProfiles();
  }, [])

  const fetchProfiles = async () => {
    const {data, error} = await getProfiles();
    if(error) 
      toast.error(error || "Faild to fetch profiles");
    else {
      setProfiles(data);
    }
  }

  console.log({profiles})

  return (
    <MobileLayout>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          mb: '20px',
          flexGrow: 1,
        }}
      >
        <Grid>
          <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '600', mb: 2 }}>
            Profiles
          </Typography>
          <Box display={'flex'} flexDirection={'column'} rowGap={1}>
            {
              profiles?.length > 0 && profiles?.map((item) => (
                <Chip
                  key={item?.id}
                  variant="outlined"
                  onClick={() => navigate(`/profiles/${item?.id}`)}
                  label={item?.title}
                  sx={startedChipsStyle}
                />
              ))
            }
          </Box>
        </Grid>
      </Container>
    </MobileLayout>
  );
};
