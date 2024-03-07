import { Box, Button, Grid, InputAdornment, Modal, Stack, TextField, Typography } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import { theme } from '../../utils/theme';
import { ArrowBackIos } from '@mui/icons-material';
import { MobileSingleSelectChip } from '../shared/MobileSingleSelectChip';
import { filterObject } from '../../constants/constants';

interface _Props extends PropsWithChildren {
    title: string;
    subtitle?: string;
}

const EditProfileInputWrapper: FC<_Props> = ({ title, children, subtitle }) => {
  return (
    <Grid item p={'12px 0px'}>
      <Stack gap={'12px'}>
        <Typography
          sx={{
            fontSize: '18px',
            fontFamily: 'Inter',
            fontWeight: 500,
            lineHeight: '27px',
          }}
        >
          {title}
        </Typography>
        <Box>{children}</Box>
      </Stack>
    </Grid>
  );
};

interface Props {
  open: boolean;
  onClose: () => void;
}

export const EditProfileModal: FC<Props> = ({ onClose, open }) => {
  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
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
              size="small"
              sx={{ bgcolor: 'rgba(221, 110, 63, 1)', color: 'white', height: '34px', width: '78px', borderRadius: '67px' }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  lineHeight: '27px',
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography
                      sx={{
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 500,
                        lineHeight: '21px',
                      }}
                    >
                      Friend
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />
          </EditProfileInputWrapper>
          
          <EditProfileInputWrapper title="Age">
          <MobileSingleSelectChip
              title={'age'}
              items={filterObject.age_category}
              selectedTag={'18 - 25'}
              handleSelect={(label: string, val: string) => {}}
            />
          </EditProfileInputWrapper>
        </Grid>
      </Grid>
    </Modal>
  );
};
