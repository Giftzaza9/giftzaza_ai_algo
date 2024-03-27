import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Grid,
  Chip,
  Typography,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { Box } from '@mui/system';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import StarIcon from '@mui/icons-material/Star';
import { getCurrencySymbol } from '../../utils/helperFunctions';
import { ProductPreviewModalUser } from './ProductPreviewModalUser';
import { FC, useEffect, useState } from 'react';
import { Product } from '../../constants/types';
import { Save } from '../shared/Icons/Save';
import { lowWidthCondition } from '../../constants/constants';
import _ from 'lodash';
import { RWebShare } from 'react-web-share';

interface Props {
  productData: Product;
  handleSave: any;
  matches?: string[];
  matchingScore?: string;
  setPrevProducts?: any;
}

export const ProductCard: FC<Props> = ({ productData, matches = [], handleSave, matchingScore, setPrevProducts }) => {
  const isSmallWidthScreen = useMediaQuery(lowWidthCondition);
  const imageBreak = useMediaQuery('(max-height: 790px)');
  const imageBreak2 = useMediaQuery('(max-height: 674px)');
  const { title, description, source, thumbnails, image, price_currency, price, rating, id, link, features } =
    productData as Product;
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    setPrevProducts((prev: Iterable<unknown> | null | undefined) => new Set(prev).add(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <>
      <Card
        sx={{
          // boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
          height: '100%',
          borderRadius: '12px',
          boxShadow: '0px 4px 4px 3px rgba(149, 157, 165, 0.2)',
          mx: '-14px',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            right: '2px',
            top: '26px',
            display: 'flex',
            flexDirection: 'column',
            rowGap: '16px',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <Box sx={{ cursor: 'pointer' }}>
            <RWebShare
              data={{
                text: title,
                url: link,
                title: source,
              }}
              onClick={() => console.log('shared successfully!')}
            >
              <button style={{ background: 'none', border: 'none' }}>
                <Save width={'22px'} height={'22px'} />
              </button>
            </RWebShare>
          </Box>
        </Box>

        {matchingScore && (
          <div className="badge-product-match">
            <span className="match">{Math.round(Number(matchingScore) * 100)}% Match</span>
          </div>
        )}

        <CardActionArea
          sx={{
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {thumbnails && thumbnails?.length > 1 ? (
            // <Box>
            <Carousel infiniteLoop swipeable dynamicHeight>
              {thumbnails?.map((thumb) => (
                // <Box sx={{ width: '100%', height: isSmallHeightScreen ? '35vh' : '40vh', marginTop: '20px' }}>
                <Box sx={{ width: '100%', height: 'calc(var(--vh, 1vh) * 50)', marginTop: '20px' }}>
                  <CardMedia
                    component="img"
                    width={'100%'}
                    height="90%"
                    sx={{ objectFit: 'contain' }}
                    image={thumb}
                    alt="product"
                  />
                </Box>
              ))}
            </Carousel>
          ) : (
            // </Box>
            <Box sx={{ width: '100%', height: '60%', marginTop: '20px' }}>
              <CardMedia
                component="img"
                width={'100%'}
                height="100%"
                sx={{ objectFit: 'contain' }}
                image={image}
                alt="product"
              />
            </Box>
          )}
          <CardContent sx={{ width: '100%', height: '30%', minHeight: '185px', paddingX: 2, paddingBottom: 0 }}>
            <Grid>
              <Chip
                label={_.capitalize(source)}
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
                  <Typography
                    sx={{
                      fontSize: imageBreak2 ? '16px' : imageBreak ? '18px' : '20px',
                      fontFamily: 'Inter',
                      fontWeight: '700',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      maxWidth: isSmallWidthScreen ? '60vw' : '75vw',
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: imageBreak2 ? '9px' : imageBreak ? '10px' : '12px',
                      fontFamily: 'Inter',
                      maxWidth: isSmallWidthScreen ? '60vw' : '75vw',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      WebkitLineClamp: imageBreak2 ? 1 : 2,
                    }}
                  >
                    {source !== 'amazon' ? description || features?.join('. ') : features?.join('. ')}
                  </Typography>
                  <Box display={'flex'} flexDirection={'row'} alignItems={'center'}>
                    <Typography
                      sx={{
                        fontSize: imageBreak2 ? '16px' : imageBreak ? '18px' : '20px',
                        fontFamily: 'Inter',
                        fontWeight: '700',
                      }}
                    >
                      {`${getCurrencySymbol(price_currency)} ${price?.toFixed(2)}`}
                    </Typography>
                    {rating - 0 > 0 && (
                      <>
                        <StarIcon sx={{ ml: 1, color: '#f1c506' }} />
                        <Typography
                          sx={{
                            fontSize: imageBreak2 ? '9px' : imageBreak ? '10px' : '12px',
                            fontFamily: 'Inter',
                            fontWeight: '600',
                          }}
                        >
                          {rating} / 5
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
                <Box>
                  <IconButton
                    onClick={() => {
                      setPreviewOpen(true);
                    }}
                    sx={{ border: '1px solid rgba(221, 110, 63, 1)' }}
                  >
                    <img
                      src={require('../../assets/arrow-down.png')}
                      alt="logo"
                      style={{
                        width: imageBreak2 ? '24px' : imageBreak ? '26px' : '30px',
                        cursor: 'pointer',
                      }}
                      // onClick={() => navigate('/')}
                    />
                  </IconButton>
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
        product={productData as Product}
        matches={matches}
      />
    </>
  );
};
