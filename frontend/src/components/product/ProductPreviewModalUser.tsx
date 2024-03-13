import { Box, CardMedia, Chip, Dialog, Grid, IconButton, Rating, Slide, Stack, Typography } from '@mui/material';
import React, { FC, PropsWithChildren } from 'react';
import { theme } from '../../utils/theme';
import { Product } from '../../constants/types';
import { ellipsisText, getCurrencySymbol } from '../../utils/helperFunctions';
import { TransitionProps } from '@mui/material/transitions';
import _ from 'lodash';
import { ArrowForwardIos } from '@mui/icons-material';
import { Carousal } from '../shared/Carousal';

const modalContainerStyles = {
  boxShadow: 24,
  width: { xs: '100vw', md: '45vw' },
  height: { xs: '100vh', md: '85vh' },
  position: { xs: 'relative', md: 'absolute' },
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  overflow: 'auto',
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  flexDirection: 'column',
  gap: '24px',
  flexWrap: 'nowrap',
  alignItems: 'center',
};

const modalHeaderStyles = {
  width: '100%',
  p: '12px 16px',
  position: 'fixed',
  top: 0,
  zIndex: 1000,
  justifyContent: 'space-between',
  backgroundColor: theme.palette.secondary.main,
  flexWrap: 'nowrap',
};

const contentContainerStyles = {
  flexDirection: 'column',
  flexWrap: 'nowrap',
  flexGrow: 1,
  gap: '5px',
  overflow: 'auto',
  paddingBottom: '75px',
  marginTop: '66px',
  backgroundColor: theme.palette.secondary.main,
};

const itemStyles = { backgroundColor: 'white', borderRadius: '8px', padding: '14px' };

const selectedChipStyle = {
  padding: '16px 8px',
  borderRadius: '32px',
  color: 'white',
  backgroundColor: 'rgba(107, 60, 102, 1)',
  fontSize: '12px',
  fontWeight: '500',
  fontFamily: 'Inter',
  cursor: 'pointer',
  width: '-webkit-fill-available',
  justifyContent: 'flex-start',
  '&:hover': {
    backgroundColor: 'rgba(107, 60, 102, 1)!important',
    color: 'white!important',
  },
  '&:active': {
    backgroundColor: 'rgba(107, 60, 102, 1)!important',
    color: 'white!important',
  },
};

const ContentWrapper: FC<{ title: string } & PropsWithChildren> = ({ title, children }) => {
  return (
    <Grid item sx={itemStyles}>
      <Typography
        sx={{
          fontSize: '11px',
          fontFamily: 'Inter',
          fontWeight: '700',
          lineHeight: '22px',
          mb: '5px',
        }}
        variant="body1"
        color={'rgba(122, 125, 130, 1)'}
      >
        {title}
      </Typography>
      <Box>{children}</Box>
    </Grid>
  );
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  open: boolean;
  onClose: () => void;
  product: Product;
  matches: string[];
}

export const ProductPreviewModalUser: FC<Props> = ({ onClose, open, product, matches }) => {
  const { title, description, source, thumbnails, image, price_currency, price, rating, link } = product;

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
      <Grid container sx={modalContainerStyles}>
        {/* Header Container */}
        <Grid container sx={modalHeaderStyles}>
          <Grid item>
            <Stack gap={'8px'}>
              <Typography
                sx={{
                  fontSize: '16px',
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  lineHeight: '24px',
                }}
              >
                {ellipsisText(title, 30)}
              </Typography>
              <Typography
                sx={{
                  fontSize: '20px',
                  fontFamily: 'Inter',
                  fontWeight: '700',
                  lineHeight: '17px',
                }}
              >
                {`${getCurrencySymbol(price_currency)} ${price?.toFixed(2)}`}
              </Typography>
            </Stack>
          </Grid>
          <Grid item>
            <IconButton
              size="small"
              onClick={() => {
                onClose();
              }}
            >
              <img
                src={require('../../assets/arrow-down.png')}
                alt="logo"
                style={{
                  width: '30px',
                  cursor: 'pointer',
                  transform: 'rotate(180deg)',
                }}
              />
            </IconButton>
          </Grid>
        </Grid>

        <Grid container sx={contentContainerStyles}>
          <Grid item sx={itemStyles}>
            {thumbnails && thumbnails?.length > 1 ? (
              <Carousal images={thumbnails} />
            ) : (
              <Box sx={{ width: '100%', height: '400px' }}>
                <CardMedia
                  component="img"
                  width={'100%'}
                  height="100%"
                  sx={{ objectFit: 'contain' }}
                  image={image}
                  alt={title}
                />
              </Box>
            )}
          </Grid>

          <ContentWrapper title="Sourced from">
            <Grid container justifyContent={'space-between'} alignItems={'center'}>
              <Grid item>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '12px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    lineHeight: '18px',
                    color: 'rgba(80, 80, 80, 1)',
                  }}
                >
                  {_.capitalize(source)}
                </Typography>
              </Grid>
              <Grid item display={'inline-flex'} alignItems={'center'}>
                <Typography
                  component={'a'}
                  href={link}
                  target="_blank"
                  variant="body2"
                  display={'inline-flex'}
                  sx={{
                    fontSize: '8px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    lineHeight: '18px',
                    color: 'rgba(72, 70, 72, 1)',
                    textDecoration: 'underline',
                  }}
                >
                  Check out
                </Typography>
                <ArrowForwardIos sx={{ height: '10px' }} />
              </Grid>
            </Grid>
          </ContentWrapper>

          <ContentWrapper title="Reviews">
            <Grid container alignItems={'center'} gap={1}>
              <Grid item>
                <Rating size="small" value={rating} precision={0.1} />
              </Grid>
              <Grid item>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '12px',
                    fontFamily: 'Inter',
                    fontWeight: '600',
                    lineHeight: '18px',
                    color: 'rgba(93, 94, 97, 1)',
                  }}
                >{`${rating} / 5`}</Typography>
              </Grid>
            </Grid>
          </ContentWrapper>

          <ContentWrapper title="Matches">
            <Grid container gap={'4px'}>
              {matches?.map((el) => (
                <Grid item key={el}>
                  <Chip variant="outlined" label={_.capitalize(el)} sx={selectedChipStyle} />
                </Grid>
              ))}
            </Grid>
          </ContentWrapper>

          <ContentWrapper title="Description">
            <Typography
              variant="body1"
              sx={{
                fontSize: '12px',
                fontFamily: 'Inter',
                fontWeight: '500',
                lineHeight: '18px',
                color: 'rgba(93, 94, 97, 1)',
              }}
            >
              {description}
            </Typography>
          </ContentWrapper>
        </Grid>
      </Grid>
    </Dialog>
  );
};
