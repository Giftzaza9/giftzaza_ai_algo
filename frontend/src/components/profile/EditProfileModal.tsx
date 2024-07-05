import { Box, Button, Dialog, Grid, InputAdornment, Slide, Stack, TextField, Typography } from '@mui/material';
import { FC, PropsWithChildren, forwardRef, useEffect, useState } from 'react';
import { theme } from '../../utils/theme';
import { ArrowBackIos } from '@mui/icons-material';
import { MobileSingleSelectChip } from '../shared/MobileSingleSelectChip';
import { budgetMap, filterObject, relationShipMap } from '../../constants/constants';
import { MobileMultiSelectChip } from '../shared/MobileMultiSelectChip';
import { Profile } from '../../constants/types';
import _ from 'lodash';
import { createProfile, updateProfile, UpdateProfileBody } from '../../services/profile';
import { toast } from 'react-toastify';
import { TransitionProps } from '@mui/material/transitions';
import { forwardButtonStyle } from '../../sections/Profiles/styles';
import { profilePayloadCleaner } from '../../utils/helperFunctions';
import { useNavigate } from 'react-router-dom';

interface _Props extends PropsWithChildren {
  title: string;
  multiSelect?: boolean;
}

const EditProfileInputWrapper: FC<_Props> = ({ title, children, multiSelect }) => {
  return (
    <Grid item p={'12px 0px'}>
      <Stack gap={'12px'}>
        <Typography
          sx={{
            fontSize: '18px',
            fontFamily: 'Inter',
            fontWeight: 500,
            lineHeight: '27px',
            display: 'inline-block',
          }}
        >
          {title}{' '}
          {multiSelect ? (
            <Typography
              variant="body1"
              sx={{
                fontSize: '11px',
                fontFamily: 'Inter',
                fontWeight: 500,
                lineHeight: '18.5px',
                color: 'rgba(125, 132, 143, 1)',
                display: 'inline-block',
              }}
            >
              ( multi-select )
            </Typography>
          ) : (
            ''
          )}
        </Typography>
        <Box>{children}</Box>
      </Stack>
    </Grid>
  );
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  onClose: (refetch?: boolean) => void;
  profile: Profile;
}

export const EditProfileModal: FC<Props> = ({ onClose, open, profile }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>(profile?.title);
  const [age, setAge] = useState<string>(profile?.age);
  const [gender, setGender] = useState<string>(profile?.gender);
  const [relation, setRelation] = useState<string>(profile?.relation);
  const [occasion, setOccasion] = useState<string>(profile?.occasion);
  const [budget, setBudget] = useState<string>(
    _.findKey(budgetMap, (val) => val.min === profile?.min_price && val.max === profile?.max_price) as string
  );
  const [minPrice, setMinPrice] = useState<number>(profile?.min_price);
  const [maxPrice, setMaxPrice] = useState<number>(profile?.max_price);
  const [styles, setStyles] = useState<string[]>(profile?.styles);
  const [interests, setInterests] = useState<string[]>(profile?.interests);

  useEffect(() => {
    setTitle(profile?.title);
    setAge(profile?.age);
    setGender(profile?.gender);
    setRelation(profile?.relation);
    setOccasion(profile?.occasion);
    setBudget(_.findKey(budgetMap, (val) => val.min === profile?.min_price && val.max === profile?.max_price) as string);
    setMinPrice(profile?.min_price);
    setMaxPrice(profile?.max_price);
    setStyles(profile?.styles);
    setInterests(profile?.interests);
  }, [profile]);

  const handleBudgetChange = (budget: string) => {
    setMinPrice(budgetMap[budget as keyof typeof budgetMap]?.min);
    setMaxPrice(budgetMap[budget as keyof typeof budgetMap]?.max);
    setBudget(budget);
  };

  const handleDone = async () => {
    try {
      const payload = profilePayloadCleaner({
        age,
        gender,
        relation,
        occasion,
        min_price: minPrice || undefined,
        max_price: maxPrice || undefined,
        styles,
        interests,
        title,
        is_shopping_profile: profile?.is_shopping_profile,
      });

      const { error, data } = !profile?.id
        ? await createProfile(payload)
        : await updateProfile(profile?.id, payload as UpdateProfileBody);

      if (error) {
        console.error(error);
      } else if (profile.id && !profile.is_shopping_profile) {
        toast.success('Profile updated successfully !');
      } else if (!profile.id && profile.is_shopping_profile && data) {
        navigate(`/profiles/${data?.id}`)
      }

      onClose(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => {
        onClose();
      }}
      TransitionComponent={Transition}
    >
      {/* Modal Main Container */}
      <Grid
        container
        sx={{
          boxShadow: 24,
          width: { xs: '100vw', md: '45vw' },
          height: { xs: '100vh', md: '85vh' },
          position: { xs: 'relative', md: 'absolute' },
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: theme.palette.secondary.main,

          //   borderRadius: '16px',
          overflow: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          flexDirection: 'column',
          gap: '24px',
          flexWrap: 'nowrap',
        }}
      >
        {/* Header Container */}
        <Grid
          container
          sx={{
            width: '100%',
            p: '16px 20px',
            position: 'fixed',
            top: 0,
            zIndex: 1000,
            justifyContent: 'space-between',
          }}
        >
          <Grid item display={'inline-flex'} alignItems={'center'} gap={'10px'}>
            <ArrowBackIos sx={{ cursor: 'pointer', color: 'rgba(221, 110, 63, 1)' }} onClick={() => onClose()} />
            <Typography
              sx={{
                // color: 'rgba(221, 110, 63, 1)',
                fontSize: '22px',
                fontFamily: 'Inter',
                fontWeight: '500',
                lineHeight: '33px',
              }}
            >
              Edit
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              sx={forwardButtonStyle}
              onClick={() => {
                handleDone();
              }}
            >
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
          </Grid>
        </Grid>

        <Grid
          container
          flexDirection={'column'}
          flexWrap={'nowrap'}
          flexGrow={1}
          overflow={'auto'}
          pb={'75px'}
          px={'12px'}
          mt={'66px'}
          //   gap={'12px'}
          bgcolor={'white'}
        >
          <EditProfileInputWrapper title="Buying for">
            <TextField
              fullWidth
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        lineHeight: '21px',
                        color: 'rgba(107, 60, 102, 1)',
                      }}
                    >
                      {_.findKey(relationShipMap, { relation, gender }) || ''}
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </EditProfileInputWrapper>

          <EditProfileInputWrapper title="Relationship*">
            <MobileSingleSelectChip
              greyText
              small
              title={'relation'}
              items={Object.keys(relationShipMap)}
              selectedTag={_.findKey(relationShipMap, { relation, gender }) || ''}
              handleSelect={(label: string, val: string) => {
                setGender(relationShipMap?.[val as keyof typeof relationShipMap]?.gender);
                setRelation(relationShipMap?.[val as keyof typeof relationShipMap]?.relation);
              }}
            />
          </EditProfileInputWrapper>

          <EditProfileInputWrapper title="Age*">
            <MobileSingleSelectChip
              greyText
              small
              title={'age'}
              items={filterObject.age_category}
              selectedTag={age}
              handleSelect={(label: string, val: string) => {
                setAge(val);
              }}
            />
          </EditProfileInputWrapper>

          <EditProfileInputWrapper title="Occasion">
            <MobileSingleSelectChip
              greyText
              small
              title={'occasion'}
              items={filterObject.occasion}
              selectedTag={occasion}
              handleSelect={(label: string, val: string) => {
                setOccasion(val);
              }}
            />
          </EditProfileInputWrapper>

          <EditProfileInputWrapper title="Budget">
            <MobileSingleSelectChip
              greyText
              small
              title={'budget'}
              items={filterObject.budget}
              selectedTag={budget}
              handleSelect={(label: string, val: string) => {
                handleBudgetChange(val);
              }}
            />
          </EditProfileInputWrapper>

          <EditProfileInputWrapper title="Style" multiSelect>
            <MobileMultiSelectChip
              greyText
              small
              items={filterObject.style}
              selectedTags={styles}
              setSelectedTags={setStyles}
            />
          </EditProfileInputWrapper>

          <EditProfileInputWrapper title="Interests" multiSelect>
            <MobileMultiSelectChip
              greyText
              small
              items={filterObject.interest}
              selectedTags={interests}
              setSelectedTags={setInterests}
            />
          </EditProfileInputWrapper>
        </Grid>
      </Grid>
    </Dialog>
  );
};
