import { Card, CardActionArea, CardMedia, CardContent, Grid, Chip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import StarIcon from '@mui/icons-material/Star';
import { ellipsisText, getCurrencySymbol } from '../../utils/helperFunctions';
import { ProductPreviewModalUser } from './ProductPreviewModalUser';
import { FC, useState } from 'react';
import { Product, RecommendedProduct } from '../../constants/types';

interface Props {
  productData: RecommendedProduct;
}

export const ProductCard: FC<Props> = ({ productData }) => {
  const { title, description, source, thumbnails, image, price_currency, price, rating } = productData?.item_id as Product;

  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <Card sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
        <CardActionArea>
          {thumbnails && thumbnails?.length > 1 ? (
            <Carousel>
              <Box sx={{ width: '100%', height: '400px', marginTop: '20px' }}>
                <CardMedia
                  component="img"
                  width={'100%'}
                  height="100%"
                  sx={{ objectFit: 'contain' }}
                  image="https://images.bloomingdalesassets.com/is/image/BLM/products/2/optimized/12956852_fpx.tif?op_sharpen=1&wid=700&fit=fit,1&$filtersm$"
                  alt="green iguana"
                />
              </Box>
              <Box sx={{ width: '100%', height: '400px', marginTop: '20px' }}>
                <CardMedia
                  component="img"
                  width={'100%'}
                  height="100%"
                  sx={{ objectFit: 'contain' }}
                  image="https://images.bloomingdalesassets.com/is/image/BLM/products/0/optimized/10977650_fpx.tif?op_sharpen=1&wid=700&fit=fit,1&$filtersm$"
                  alt="green iguana"
                />
              </Box>
              <Box sx={{ width: '100%', height: '400px', marginTop: '20px' }}>
                <CardMedia
                  component="img"
                  width={'100%'}
                  height="100%"
                  sx={{ objectFit: 'contain' }}
                  image="https://images.bloomingdalesassets.com/is/image/BLM/products/6/optimized/13129996_fpx.tif?op_sharpen=1&wid=700&fit=fit,1&$filtersm$"
                  alt="green iguana"
                />
              </Box>
            </Carousel>
          ) : (
            <Box sx={{ width: '100%', height: '400px', marginTop: '20px' }}>
              <CardMedia
                component="img"
                width={'100%'}
                height="100%"
                sx={{ objectFit: 'contain' }}
                image={image}
                alt="green iguana"
              />
            </Box>
          )}
          <CardContent>
            <Grid>
              <Chip
                label={source}
                sx={{
                  padding: '10px 4 px',
                  color: 'rgba(221, 110, 63, 1)',
                  backgroundColor: 'rgba(247, 227, 141, 0.42)',
                  fontSize: '14px',
                  fontWeight: '700',
                }}
              />
              <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
                <Box display={'flex'} flexDirection={'column'} rowGap={1} mt={1}>
                  <Typography sx={{ fontSize: '20px', fontFamily: 'Inter', fontWeight: '700' }}>
                    {ellipsisText(title, 42)}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', fontFamily: 'Inter' }}>{ellipsisText(description, 95)}</Typography>
                  <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                    <Typography sx={{ fontSize: '20px', fontFamily: 'Inter', fontWeight: '700' }}>
                      {getCurrencySymbol(price_currency)}
                      {price}
                    </Typography>
                    {rating - 0 > 0 && (
                      <>
                        <StarIcon sx={{ ml: 1, color: '#e1e26c' }} />
                        <Typography sx={{ fontSize: '12px', fontFamily: 'Inter', fontWeight: '600' }}>
                          {rating} / 5 (2400 ratings)
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
                <Box
                  onClick={() => {
                    setPreviewOpen(true);
                  }}
                >
                  <img
                    src={require('../../assets/arrow-down.png')}
                    alt="logo"
                    style={{
                      width: '30px',
                      cursor: 'pointer',
                    }}
                    // onClick={() => navigate('/')}
                  />
                </Box>
              </Box>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
      <ProductPreviewModalUser
        onClose={() => {
          setPreviewOpen(false);
        }}
        open={previewOpen}
        product={productData?.item_id as Product}
      />
    </>
  );
};
