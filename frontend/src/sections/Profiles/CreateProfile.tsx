import React, { useCallback, useEffect, useState } from 'react';
import {
  Typography,
  Container,
  Grid,
  Box,
  Chip,
  TextField,
  LinearProgress,
  CircularProgress,
  Button,
  useMediaQuery,
} from '@mui/material';
import { MobileLayout } from '../../components/shared/MobileLayout';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { MobileSingleSelectChip } from '../../components/shared/MobileSingleSelectChip';
import {
  budgetMap,
  filterObject,
  initialProfileData,
  iphoneSeCondition,
  landingChips,
  relationShipMap,
  Steps,
} from '../../constants/constants';
import { MobileMultiSelectChip } from '../../components/shared/MobileMultiSelectChip';
import { Profile } from '../../constants/types';
import { toast } from 'react-toastify';
import { CreateProfileBody, createProfile } from '../../services/profile';
import { useNavigate } from 'react-router';
import { animationStyle, forwardButtonStyle, startedChipsStyle } from './styles';
import { theme } from '../../utils/theme';
import { MobileDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { SkipNextOutlined } from '@mui/icons-material';
import _ from 'lodash';
import { profilePayloadCleaner } from '../../utils/helperFunctions';

export const CreateProfile = () => {
  const isSmallScreen = useMediaQuery(iphoneSeCondition);
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(0);
  const [styles, setSelectedStyles] = useState<string[]>([]);
  const [interests, setSelectedInterests] = useState<string[]>([]);
  const [profileData, setProfileData] = useState<Profile>(initialProfileData as Profile);

  const handleCreateProfileData = useCallback((label: string, data: any, page: number) => {
    if (label) {
      setProfileData((prev: any) => ({
        ...prev,
        [label]: data,
      }));
    }
    setPage((prev) => prev + page);
  }, []);

  useEffect(() => {
    handleCreateProfileData('styles', styles, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [styles?.length]);

  useEffect(() => {
    handleCreateProfileData('interests', interests, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interests?.length]);

  const handleStarted = (val: string) => {
    if (val === landingChips.view) {
      navigate('/profiles');
    } else if (val === landingChips.forHusband) {
      handleCreateProfileData('title', val, 0);
      handleCreateProfileData('gender', 'male', 0);
      handleCreateProfileData('relation', 'Spouse or Significant Other', Steps.AGE);
    } else if (val === landingChips.forMom) {
      handleCreateProfileData('title', val, 0);
      handleCreateProfileData('gender', 'female', 0);
      handleCreateProfileData('relation', 'Parent', Steps.AGE);
    } else if (val === landingChips.shopping) navigate('/shopping');
    else handleCreateProfileData('', val, Steps.RELATION);
  };

  const handleCreateProfile = async () => {
    const { budget, ...payloadWithoutBudget } = profileData;
    let payload: CreateProfileBody = {
      ...payloadWithoutBudget,
      min_price: budgetMap[budget as keyof typeof budgetMap]?.min || undefined,
      max_price: budgetMap[budget as keyof typeof budgetMap]?.max || undefined,
    };
    payload = profilePayloadCleaner(payload);
    const { data, error } = await createProfile(payload!);
    if (!error && data) {
      console.log(data);
      navigate(`/profiles/${data?.id}`);
    }
  };

  const handleArrows = (val: number) => {
    if (page === Steps.RELATION && val === 1 && !profileData?.relation && !profileData?.gender) {
      toast.warn('Please select relation !');
      return;
    } else if (page === Steps.AGE && val === 1 && !profileData?.age) {
      toast.warn('Please select the age-range !');
      return;
    }
    // } else if (page === Steps.NAME && val === 1 && !profileData?.title) {
    //   toast.warn('Please add a name !');
    //   return;
    // } else if (page === Steps.OCCASION && val === 1 && !profileData?.occasion_date) {
    //   toast.warn('Please select an occasion !');
    //   return;
    // } else if (page === Steps.DATE && val === 1 && !profileData?.age) {
    //   toast.warn('Please select an date for the occasion!');
    //   return;
    // } else if (page === Steps.BUDGET && val === 1 && !profileData?.budget) {
    //   toast.warn('Please select budget !');
    //   return;
    // } else if (page === Steps.STYLE && val === 1 && (profileData?.styles?.length as number) <= 0) {
    //   toast.warn('Please select styles !');
    //   return;
    // } else if (page === Steps.INTEREST && val === 1 && (profileData?.interests?.length as number) <= 0) {
    //   toast.warn('Please select interests !');
    //   return;
    // }

    if (page === Steps.INTEREST && val === 1) {
      console.log({ profileData });
      handleCreateProfile();
      return;
    }
    setPage((prev) => prev + val);
  };

  const handleSingleSelect = useCallback(
    (label: keyof CreateProfileBody, val: string) => {
      handleCreateProfileData(label, val, 1);
    },
    [handleCreateProfileData]
  );

  const handleSkip = () => {
    setPage(Steps.END);
    handleCreateProfile();
  };

  return (
    <MobileLayout>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          position: 'relative',
          flexGrow: 1,
        }}
      >
        {/* Progress bar and next & prev arrows */}
        {page !== Steps.LANDING && page !== Steps.END && (
          <>
            <Grid
              position={'absolute'}
              width={'95%'}
              zIndex={10}
              bgcolor={theme.palette.secondary.main}
              alignSelf={'center'}
              top={0}
            >
              <LinearProgress
                color="primary"
                variant="determinate"
                value={(page / (Steps.END - 1)) * 100}
                sx={{
                  '& .MuiLinearProgress-barColorPrimary': {
                    backgroundColor: 'black',
                  },
                }}
              />
              <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} my={2}>
                <ArrowBackIosIcon
                  sx={{
                    cursor: 'pointer',
                    color: 'rgba(221, 110, 63, 1)',
                    visibility: page === Steps.LANDING ? 'hidden' : 'visible',
                  }}
                  onClick={() => handleArrows(-1)}
                />
                <Typography sx={{ fontSize: '16px', fontFamily: 'Inter', fontWeight: '500' }}>
                  Step {page}/{Steps.END - 1}
                </Typography>
                {page === Steps.END ? (
                  <Button variant="contained" sx={forwardButtonStyle} onClick={() => handleArrows(1)}>
                    <Typography
                      sx={{
                        fontSize: '16px',
                        fontFamily: 'Inter',
                        fontWeight: 600,
                        textTransform: 'none',
                      }}
                    >
                      Done
                    </Typography>
                  </Button>
                ) : (
                  <ArrowForwardIosIcon
                    sx={{
                      cursor: 'pointer',
                      color: 'rgba(221, 110, 63, 1)',
                      visibility: page === Steps.LANDING && !profileData?.title ? 'hidden' : 'visible',
                    }}
                    onClick={() => handleArrows(1)}
                  />
                )}
              </Box>
            </Grid>

            {page !== Steps.END && page !== Steps.LANDING && (
              <Grid
                container
                position={'absolute'}
                width={'95%'}
                zIndex={10}
                // bgcolor={theme.palette.secondary.main}
                alignSelf={'center'}
                justifyContent="center"
                alignItems="center"
                top={'48px'}
              >
                <Button
                  variant="contained"
                  disabled={page === Steps.RELATION || page === Steps.AGE}
                  size="small"
                  endIcon={<SkipNextOutlined />}
                  sx={{ padding: '4px 12px!important' }}
                  onClick={handleSkip}
                >
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontFamily: 'Inter',
                      fontWeight: 500,
                      textTransform: 'none',
                    }}
                  >
                    Skip
                  </Typography>
                </Button>
              </Grid>
            )}
          </>
        )}

        {/* Step 0: Starting Page */}

        {page === Steps.LANDING && (
          <>
            <Grid sx={animationStyle}>
              <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '400', mb: 2, pl: 2 }}>
                Let’s get started
              </Typography>
              <Box display={'flex'} flexDirection={'column'} rowGap={'10px'} p={1}>
                {Object.values(landingChips).map((el, index) => (
                  <Chip
                    key={index}
                    variant="outlined"
                    onClick={(e: any) => handleStarted(e.target.textContent)}
                    label={el}
                    sx={{
                      ...startedChipsStyle,
                      padding: isSmallScreen ? '24px 12px' : startedChipsStyle.padding,
                      fontSize: isSmallScreen ? '16px' : startedChipsStyle.fontSize,
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </>
        )}

        {/* Page 1: Relation */}

        {page === Steps.RELATION && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '400', mb: 2 }}>
              Who's this gift for?
            </Typography>
            <MobileSingleSelectChip
              small
              title={'relation'}
              items={Object.keys(relationShipMap)}
              selectedTag={
                _.findKey(relationShipMap, { relation: profileData?.relation, gender: profileData?.gender }) || ''
              }
              handleSelect={(label, val) => {
                handleCreateProfileData('gender', relationShipMap?.[val as keyof typeof relationShipMap]?.gender, 0);
                handleSingleSelect('relation', relationShipMap?.[val as keyof typeof relationShipMap]?.relation);
              }}
            />
          </Grid>
        )}

        {/* Page 2: Age */}

        {page === Steps.AGE && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '400', mb: 2 }}>
              What’s their age?
            </Typography>
            <MobileSingleSelectChip
              small
              title={'age'}
              items={filterObject.age_category}
              selectedTag={profileData?.age as string}
              handleSelect={handleSingleSelect}
            />
          </Grid>
        )}

        {/* Page 3: Name */}

        {page === Steps.NAME && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '400', mb: 2 }}>
              What's their name?
            </Typography>
            <Box display={'flex'} flexDirection={'column'} rowGap={1} pb={1}>
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

        {/* Page 4: Occasion */}

        {page === Steps.OCCASION && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '400', mb: 2 }}>
              What’s the occasion?
            </Typography>
            <MobileSingleSelectChip
              small
              title={'occasion'}
              items={filterObject.occasion}
              selectedTag={profileData?.occasion as string}
              handleSelect={handleSingleSelect}
            />
          </Grid>
        )}

        {/* Page 5: Date */}

        {page === Steps.DATE && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '400', mb: 2 }}>
              When’s the occasion?
            </Typography>
            <Box display={'flex'} flexDirection={'column'} rowGap={1} pb={1}>
              <MobileDatePicker
                defaultValue={dayjs()}
                value={dayjs(profileData?.occasion_date as string)}
                onChange={(val) => handleSingleSelect('occasion_date', val?.toISOString() as string)}
                minDate={dayjs()}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: {
                    variant: 'outlined',
                    size: 'small',

                    InputProps: {
                      style: {
                        ...startedChipsStyle,
                        padding: '6px',
                        fontSize: '16px',
                      },
                    },
                  },
                }}
              />
            </Box>
          </Grid>
        )}

        {/* Page 5: Gender

        {page === 5 && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '400', mb: 2 }}>
              Gender
            </Typography>
            <Box display={'flex'} flexDirection={'column'} rowGap={1} pb={1}>
              {filterObject?.gender.map((item) => (
                <Chip
                  variant="outlined"
                  color="primary"
                  icon={
                    profileData?.gender === item ? (
                      <TripOriginIcon style={{ marginRight: '1px', fontSize: '36px' }} />
                    ) : (
                      <PanoramaFishEyeIcon style={{ marginRight: '5px', fontSize: '30px' }} />
                    )
                  }
                  sx={genderChipsStyle}
                  label={item}
                  onClick={() => handleCreateProfileData('gender', item, 1)}
                />
              ))}
            </Box>
          </Grid>
        )} */}

        {/* Page 6: Budget */}

        {page === Steps.BUDGET && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '400', mb: 2 }}>
              What’s the budget?
            </Typography>
            <MobileSingleSelectChip
              small
              title={'budget'}
              items={filterObject.budget}
              selectedTag={profileData?.budget as string}
              handleSelect={handleSingleSelect}
            />
          </Grid>
        )}

        {/* Page 7: Style */}

        {page === Steps.STYLE && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '400', mb: 1 }}>
              Now, tell me a bit about their style?
            </Typography>
            <Typography sx={{ fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', mb: 2 }}>
              Choose as many as you want
            </Typography>
            <MobileMultiSelectChip
              small
              items={filterObject.style}
              selectedTags={styles}
              setSelectedTags={setSelectedStyles}
            />
          </Grid>
        )}

        {/* Page 8: Interests */}

        {page === Steps.INTEREST && (
          <Grid sx={animationStyle}>
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '400', mb: 1 }}>
              What are their Interests?
            </Typography>
            <Typography sx={{ fontSize: '16px', fontFamily: 'Inter', fontWeight: '400', mb: 2 }}>
              Choose as many as you want
            </Typography>
            <MobileMultiSelectChip
              // centerAligned
              small
              items={filterObject.interest}
              selectedTags={interests}
              setSelectedTags={setSelectedInterests}
            />
          </Grid>
        )}

        {/* Page 9: Generating */}

        {page === Steps.END && (
          <Grid
            display={'flex'}
            flexGrow={1}
            flexDirection={'column'}
            justifyContent={'center'}
            textAlign={'center'}
            sx={animationStyle}
          >
            <Typography sx={{ fontSize: '32px', fontFamily: 'DM Serif Display', fontWeight: '400', mb: 1 }}>
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
            <Typography sx={{ fontSize: '26px', fontFamily: 'Inter', fontWeight: '400', mb: 1 }}>Please wait...</Typography>
          </Grid>
        )}
      </Container>
    </MobileLayout>
  );
};
