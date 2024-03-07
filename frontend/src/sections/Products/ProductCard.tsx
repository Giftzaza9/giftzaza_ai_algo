import { Card, CardActionArea, CardMedia, CardContent, Grid, Chip, Typography } from '@mui/material';
import { Box } from '@mui/system';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import StarIcon from '@mui/icons-material/Star';
import { ellipsisText } from '../../utils/helperFunctions';

// interface ContentProps {
//     title: string;
//     description: string;
//     source: string;
// }

export const ProductCard = ({ productData }: any) => {
  console.log({ productData });
  const { title, description, source } = productData;
  return (
    <Card sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
      <CardActionArea>
        <Box>
          {/* <CardMedia component="img" width={"100%"} height="100%" sx={{ objectFit: "contain" }} image="https://images.bloomingdalesassets.com/is/image/BLM/products/2/optimized/12956852_fpx.tif?op_sharpen=1&wid=700&fit=fit,1&$filtersm$" alt="green iguana" /> */}
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
        </Box>
        <CardContent>
          <Grid sx={{ p: 2, pt: 0 }}>
            <Chip
              label={source}
              sx={{
                padding: '10px 4 px',
                color: 'rgba(221, 110, 63, 1)',
                backgroundColor: 'rgba(247, 227, 141, 0.42)',
                fontSize: '16px',
                fontWeight: '700',
              }}
            />
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
              <Box display={'flex'} flexDirection={'column'} rowGap={1} mt={1}>
                <Typography sx={{ fontSize: '22px', fontFamily: 'Inter', fontWeight: '700' }}>
                  {ellipsisText(title, 55)}
                </Typography>
                <Typography sx={{ fontSize: '17px', fontFamily: 'Inter' }}>{ellipsisText(description, 135)}</Typography>
                <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                  <Typography sx={{ fontSize: '22px', fontFamily: 'Inter', fontWeight: '700' }}>$1121.99</Typography>
                  <StarIcon sx={{ ml: 1, color: '#e1e26c' }} />
                  <Typography sx={{ fontSize: '17px', fontFamily: 'Inter', fontWeight: '600' }}>
                    4.5 / 5 (2400 ratings)
                  </Typography>
                </Box>
              </Box>
              <Box>
                <img
                  src={require('../../assets/arrow-down.png')}
                  alt="logo"
                  style={{
                    width: '40px',
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
  );
};
