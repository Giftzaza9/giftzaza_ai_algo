import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid, Box, Chip, TextField, LinearProgress, CircularProgress } from '@mui/material';
import { MobileLayout } from '../../components/shared/MobileLayout';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { MobileSingleSelectChip } from '../../components/shared/MobileSingleSelectChip';
import { filterObject } from '../../constants/constants';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import { MobileMultiSelectChip } from '../../components/shared/MobileMultiSelectChip';
import { Profile, ProfileDataWithPrice } from '../../constants/types';
import { toast } from 'react-toastify';
import { createProfile } from '../../services/profile';
import { useNavigate } from 'react-router';

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

const genderChipsStyle = {
  display: 'flex',
  flexDirection: 'row-reverse',
  justifyContent: 'space-between',
  padding: '32px 15px',
  borderRadius: '32px',
  backgroundColor: 'white',
  color: 'rgba(0, 0, 0, 1)',
  fontSize: '18px',
  fontWeight: '600',
  fontFamily: 'Inter',
  cursor: 'pointer',
  width: '-webkit-fill-available',
};

const animationStyle = {
  animation: 'fadeIn 0.3s ease-in',
};

const initalProfileData: Profile = {
  styles: [],
  interests: [],
  title: '',
  relation: '',
  age: '',
  gender: '',
  occasion: '',
  occasion_date: '',
  budget: '',
};

export const Profiles = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(0);
  const [styles, setSelectedStyles] = useState<string[]>([]);
  const [interests, setSelectedInterests] = useState<string[]>([]);
  const [profileData, setProfileData] = useState<Profile>(initalProfileData);

  useEffect(() => {
    handleCreateProfileData('styles', styles, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styles?.length]);

  useEffect(() => {
    handleCreateProfileData('interests', interests, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interests?.length]);

  const handleStarted = (val: string) => {
    console.log(val);
    if (val === 'Discover gifts for your spouse') handleCreateProfileData('title', val, 2);
    else if (val === 'Discover gifts for your mom') {
      handleCreateProfileData('title', val, 0);
      handleCreateProfileData('relation', 'Parents', 3);
    } else handleCreateProfileData('', val, 1);
  };

  const handleCreateProfile = async () => {
    const { budget, ...payloadWithoutBudget } = profileData;
    const payload: ProfileDataWithPrice = {
      ...payloadWithoutBudget,
      min_price: parseInt(budget?.split('-')?.[0]?.slice(1)),
      max_price: parseInt(budget?.split('-')?.[1]?.slice(1)),
    };
    console.log({ payload });
    const { data, error } = await createProfile(payload!);
    if (error) {
      toast.error(error || 'Failed to create profile !');
    } else {
      console.log(data);
      toast.success('Profile Created');
      navigate(`/profiles/${data?.id}`);
    }
  };

  const handleArrows = (val: number) => {
    if (page === 1 && val === 1 && !profileData?.title?.trim()) {
      toast.warn('Please add name !');
      return;
    } else if (page === 2 && val === 1 && !profileData?.relation) {
      toast.warn('Please select relation !');
      return;
    } else if (page === 3 && val === 1 && !profileData?.age) {
      toast.warn('Please select age !');
      return;
    } else if (page === 4 && val === 1 && !profileData?.gender) {
      toast.warn('Please select gender !');
      return;
    } else if (page === 5 && val === 1 && !profileData?.occasion) {
      toast.warn('Please select occasion !');
      return;
    } else if (page === 6 && val === 1 && !profileData?.occasion_date) {
      toast.warn('Please select occasion date !');
      return;
    } else if (page === 7 && val === 1 && !profileData?.budget) {
      toast.warn('Please select budget !');
      return;
    } else if (page === 8 && val === 1 && (profileData?.styles?.length as number) <= 0) {
      toast.warn('Please select styles !');
      return;
    } else if (page === 9 && val === 1 && (profileData?.interests?.length as number) <= 0) {
      toast.warn('Please select interests !');
      return;
    }

    if (page === 9) {
      console.log({ profileData });
      handleCreateProfile();
      return;
    }
    setPage((prev) => prev + val);
  };

  const handleSingleSelect = (label: string, val: string) => {
    console.log(label + ' ' + val);
    if (label === 'age' && profileData?.title === 'Discover gifts for your mom') {
      handleCreateProfileData(label, val, 0);
      handleCreateProfileData('gender', 'Female', 2);
    } else handleCreateProfileData(label, val, 1);
  };

  const handleCreateProfileData = (label: string, data: any, page: number) => {
    if (label) {
      setProfileData((prev: any) => ({
        ...prev,
        [label]: data,
      }));
    }
    setPage((prev) => prev + page);
  };
  // console.log({ profileData });
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
        {/* Progess bar and next & prev arrows */}
        {page !== 10 && (
          <Grid>
            <LinearProgress
              color="primary"
              variant="determinate"
              value={page * 10}
              sx={{
                '& .MuiLinearProgress-barColorPrimary': {
                  backgroundColor: 'black',
                },
              }}
            />
            {
              <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} my={2}>
                <ArrowBackIosIcon
                  sx={{ cursor: 'pointer', color: 'rgba(221, 110, 63, 1)', visibility: page === 0 ? 'hidden' : 'visible' }}
                  onClick={() => handleArrows(-1)}
                />
                {page === 9 ? (
                  <Typography
                    sx={{
                      cursor: 'pointer',
                      color: 'rgba(221, 110, 63, 1)',
                      fontSize: '18px',
                      fontFamily: 'Inter',
                      fontWeight: '700',
                    }}
                    onClick={() => handleArrows(1)}
                  >
                    Done
                  </Typography>
                ) : (
                  <ArrowForwardIosIcon
                    sx={{
                      cursor: 'pointer',
                      color: 'rgba(221, 110, 63, 1)',
                      visibility: page === 0 && !profileData?.title ? 'hidden' : 'visible',
                    }}
                    onClick={() => handleArrows(1)}
                  />
                )}
              </Box>
            }
          </Grid>
        )}
        {page === 0 && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '600', mb: 2 }}>
              Let’s get started
            </Typography>
            <Box display={'flex'} flexDirection={'column'} rowGap={1}>
              <Chip
                variant="outlined"
                onClick={(e: any) => handleStarted(e.target.textContent)}
                label={'Discover gifts for your spouse'}
                sx={startedChipsStyle}
              />
              <Chip
                variant="outlined"
                onClick={(e: any) => handleStarted(e.target.textContent)}
                label={'Discover gifts for your mom'}
                sx={startedChipsStyle}
              />
              <Chip
                variant="outlined"
                onClick={(e: any) => handleStarted(e.target.textContent)}
                label={'Create a new giftee profile'}
                sx={startedChipsStyle}
              />
              <Chip
                variant="outlined"
                onClick={(e: any) => handleStarted(e.target.textContent)}
                label={'View existing giftee profiles'}
                sx={startedChipsStyle}
              />
              <Chip
                variant="outlined"
                onClick={(e: any) => handleStarted(e.target.textContent)}
                label={'Surprise me'}
                sx={startedChipsStyle}
              />
            </Box>
          </Grid>
        )}
        {page === 1 && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '600', mb: 2 }}>
              Who is this gift for?
            </Typography>
            <Box display={'flex'} flexDirection={'column'} rowGap={1}>
              <TextField
                variant="outlined"
                placeholder="Name"
                InputProps={{
                  style: { ...startedChipsStyle, padding: '0 6px' },
                }}
                value={profileData?.title as string}
                onChange={(e) => handleCreateProfileData('title', e.target.value, 0)}
              />
            </Box>
          </Grid>
        )}
        {page === 2 && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '600', mb: 2 }}>
              How are you related?
            </Typography>
            <MobileSingleSelectChip
              title={'relation'}
              items={filterObject.relationship}
              selectedTag={profileData?.relation as string}
              handleSelect={handleSingleSelect}
            />
          </Grid>
        )}
        {page === 3 && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '600', mb: 2 }}>
              What’s their age?
            </Typography>
            <MobileSingleSelectChip
              title={'age'}
              items={filterObject.age_category}
              selectedTag={profileData?.age as string}
              handleSelect={handleSingleSelect}
            />
          </Grid>
        )}
        {page === 4 && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '600', mb: 2 }}>
              Gender
            </Typography>
            <Box display={'flex'} flexDirection={'column'} rowGap={1}>
              <Chip
                variant="outlined"
                color="primary"
                icon={
                  profileData?.gender === 'Male' ? (
                    <TripOriginIcon style={{ marginRight: '1px', fontSize: '36px' }} />
                  ) : (
                    <PanoramaFishEyeIcon style={{ marginRight: '5px', fontSize: '30px' }} />
                  )
                }
                sx={genderChipsStyle}
                label="Male"
                onClick={() => handleCreateProfileData('gender', 'Male', 1)}
              />
              <Chip
                variant="outlined"
                color="primary"
                icon={
                  profileData?.gender === 'Female' ? (
                    <TripOriginIcon style={{ marginRight: '1px', fontSize: '36px' }} />
                  ) : (
                    <PanoramaFishEyeIcon style={{ marginRight: '5px', fontSize: '30px' }} />
                  )
                }
                sx={genderChipsStyle}
                label="Female"
                onClick={() => handleCreateProfileData('gender', 'Female', 1)}
              />
              <Chip
                variant="outlined"
                color="primary"
                icon={
                  profileData?.gender === 'Other' ? (
                    <TripOriginIcon style={{ marginRight: '1px', fontSize: '36px' }} />
                  ) : (
                    <PanoramaFishEyeIcon style={{ marginRight: '5px', fontSize: '30px' }} />
                  )
                }
                sx={genderChipsStyle}
                label="Other"
                onClick={() => handleCreateProfileData('gender', 'Other', 1)}
              />
            </Box>
          </Grid>
        )}
        {page === 5 && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '600', mb: 2 }}>
              What’s the occasion?
            </Typography>
            <MobileSingleSelectChip
              title={'occasion'}
              items={filterObject.occasion}
              selectedTag={profileData?.occasion as string}
              handleSelect={handleSingleSelect}
            />
          </Grid>
        )}
        {page === 6 && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '600', mb: 2 }}>
              When’s the occasion?
            </Typography>
            <Box display={'flex'} flexDirection={'column'} rowGap={1}>
              <TextField
                type="Date"
                variant="outlined"
                placeholder="Name"
                InputProps={{
                  style: { ...startedChipsStyle, padding: '0 6px' },
                }}
                value={profileData?.occasion_date as string}
                onChange={(e) => handleSingleSelect('occasion_date', e.target.value)}
              />
            </Box>
          </Grid>
        )}
        {page === 7 && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '600', mb: 2 }}>
              What’s the budget?
            </Typography>
            <MobileSingleSelectChip
              title={'budget'}
              items={filterObject.budget}
              selectedTag={profileData?.budget as string}
              handleSelect={handleSingleSelect}
            />
          </Grid>
        )}
        {page === 8 && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '600', mb: 1 }}>
              Tell me about their style?
            </Typography>
            <Typography sx={{ fontSize: '16px', fontFamily: 'Inter', fontWeight: '600', mb: 2 }}>
              Choose as many as you want
            </Typography>
            <MobileMultiSelectChip items={filterObject.style} selectedTags={styles} setSelectedTags={setSelectedStyles} />
          </Grid>
        )}
        {page === 9 && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '600', mb: 1 }}>
              What are their Interests?
            </Typography>
            <Typography sx={{ fontSize: '16px', fontFamily: 'Inter', fontWeight: '600', mb: 2 }}>
              Choose as many as you want
            </Typography>
            <MobileMultiSelectChip
              items={filterObject.interest}
              selectedTags={interests}
              setSelectedTags={setSelectedInterests}
            />
          </Grid>
        )}
        {page === 10 && (
          <Grid
            display={'flex'}
            flexGrow={1}
            flexDirection={'column'}
            justifyContent={'center'}
            textAlign={'center'}
            sx={animationStyle}
          >
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '600', mb: 1 }}>
              Giftzaza recommendations are being generated
            </Typography>
            <CircularProgress
              sx={{
                width: '150px!important',
                height: '150px!important',
                color: '#DD6E3F',
                alignSelf: 'center',
                margin: '20px auto',
              }}
            />
            <Typography sx={{ fontSize: '26px', fontFamily: 'Inter', fontWeight: '600', mb: 1 }}>Please wait...</Typography>
          </Grid>
        )}
      </Container>
    </MobileLayout>
  );
};
