import { Card, CardActionArea, CardMedia, CardContent, Grid, Chip, Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import StarIcon from '@mui/icons-material/Star';
import { ellipsisText, getCurrencySymbol } from '../../utils/helperFunctions';
import { ProductPreviewModalUser } from './ProductPreviewModalUser';
import { FC, useEffect, useState } from 'react';
import { Product, RecommendedProduct } from '../../constants/types';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { Save } from '../shared/Icons/Save';
import { iphoneSeCondition } from '../../constants/constants';

interface Props {
  productData: RecommendedProduct;
  handleSave: any;
  matches: string[];
  matchingScore: string;
  setPrevProducts: any;
}

export const ProductCard: FC<Props> = ({ productData, matches = [], handleSave, matchingScore, setPrevProducts }) => {
  const isSmallScreen = useMediaQuery(iphoneSeCondition);
  const { title, description, source, thumbnails, image, price_currency, price, rating, id } =
    productData?.item_id as Product;

  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setPrevProducts((prev: Iterable<unknown> | null | undefined) => new Set(prev).add(id));
  }, [id]);

  return (
    <>
      <Card sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}>
        <Box
          sx={{
            position: 'absolute',
            right: '10px',
            top: '20px',
            display: 'flex',
            flexDirection: 'column',
            rowGap: '16px',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          <Save width={'22px'} height={'22px'} />
          <BookmarkBorderIcon sx={{ fontSize: '28px' }} onClick={() => handleSave()} />
        </Box>

        <div className="badge-product-match">
          <span className="match">{Math.round(Number(matchingScore) * 100)}% Match</span>
        </div>

        <CardActionArea>
          {thumbnails && thumbnails?.length > 1 ? (
            <Carousel>
              {thumbnails?.map((thumb) => (
                <Box sx={{ width: '100%', height: isSmallScreen ? '220px' : '400px', marginTop: '20px' }}>
                  <CardMedia
                    component="img"
                    width={'100%'}
                    height="100%"
                    sx={{ objectFit: 'contain' }}
                    image={thumb}
                    alt="green iguana"
                  />
                </Box>
              ))}
            </Carousel>
          ) : (
            <Box sx={{ width: '100%', height: isSmallScreen ? '220px' : '400px', marginTop: '20px' }}>
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
                    {ellipsisText(title, 22)}
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
        matches={matches}
      />
    </>
  );
};
