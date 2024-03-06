import { Box, Chip, Fade, Grid, Rating, Stack, Tooltip, Typography } from '@mui/material';
import { FC } from 'react';
import { Product } from '../../constants/types';
import { ellipsisText, getCurrencySymbol } from '../../utils/helperFunctions';
import { Amazon } from '../shared/Icons/Amazon';
import { Bloomingdales } from '../shared/Icons/Bloomingdales';
import _ from 'lodash';
import { Carousal } from '../shared/Carousal';

interface Props {
  product: Product;
}

export const PreviewProduct: FC<Props> = ({ product }) => {
  return (
    <>
      <Grid item height={'260px'} position={'relative'}>
        {product?.curated && (
          <Typography
            fontWeight={500}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              bgcolor: 'rgba(168, 108, 198, 1)',
              color: 'white',
              display: 'inline-flex',
              padding: '2px 14px',
              fontSize: '14px',
              borderRadius: '4px',
            }}
          >
            Curated
          </Typography>
        )}
        <Tooltip title={_.capitalize(product?.source)} followCursor color="primary">
          <Box
            sx={{
              position: 'absolute',
              top: '4px',
              right: '8px',
            }}
          >
            {product?.source === 'amazon' ? <Amazon /> : <Bloomingdales />}
          </Box>
        </Tooltip>
        {product?.thumbnails?.length ? (
          <Carousal images={product?.thumbnails} />
        ) : (
          <img
            src={product?.image ?? ''}
            alt={product?.title}
            style={{ objectFit: 'contain', width: '100%', height: '100%' }}
          />
        )}
        {/* <img src={product?.image} alt={product?.title} style={{ objectFit: 'contain', width: '100%', height: '100%' }} /> */}
      </Grid>

      <Grid item>
        {product?.title !== undefined && product?.title?.length > 120 ? (
          <Tooltip
            title={product?.title}
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            followCursor
            children={
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(43, 50, 59, 1)',
                  fontSize: '20px',
                  fontWeight: 600,
                  lineHeight: '20px',
                  fontFamily: 'Manrope',
                }}
              >
                {ellipsisText(product?.title, 120)}
              </Typography>
            }
          />
        ) : (
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(43, 50, 59, 1)',
              fontSize: '20px',
              fontWeight: 600,
              lineHeight: '20px',
              fontFamily: 'Manrope',
            }}
          >
            {product?.title}
          </Typography>
        )}
      </Grid>

      <Grid item>
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Typography variant="h6" sx={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 600, lineHeight: '18.15px' }}>
            {getCurrencySymbol(product?.price_currency)} {product?.price?.toFixed(2)}
          </Typography>
          <Tooltip title={product?.rating} TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} followCursor>
            <Box>
              <Rating value={product?.rating} precision={0.1} readOnly sx={{ color: 'rgba(125, 141, 160, 1)' }} />
            </Box>
          </Tooltip>
        </Stack>
      </Grid>

      <Grid item>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(125, 141, 160, 1)',
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: '16px',
            fontFamily: 'Manrope',
          }}
        >
          {product?.description}
        </Typography>
      </Grid>

      <Grid item>
        <Grid container gap={1}>
          {product?.tags?.map((tag) => (
            <Grid item>
              <Chip
                size="small"
                label={
                  <Typography
                    variant="caption"
                    sx={{ fontSize: '9px', color: 'rgba(211, 95, 106, 1)', fontWeight: 600, lineHeight: '13px' }}
                  >
                    {tag}
                  </Typography>
                }
                variant="outlined"
                color="error"
                sx={{ backgroundColor: 'rgba(251, 234, 236, 1)' }}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
};
