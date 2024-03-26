import { Box, Grid, IconButton, Stack, Typography } from '@mui/material';
import { MobileLayout } from '../../components/shared/MobileLayout';
import { getCurrencySymbol } from '../../utils/helperFunctions';
import { Close, Star } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { getSavedProducts } from '../../services/user';
import { Product, SavedItem } from '../../constants/types';
import { ProductPreviewModalUser } from '../../components/product/ProductPreviewModalUser';

export const Saved = () => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [previewProduct, setPreviewProduct] = useState<Product | undefined>();
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);

  const handlePreviewClose = () => {
    setPreviewModalOpen(false);
    setPreviewProduct(undefined);
  };

  const handlePreviewOpen = (product: Product) => {
    setPreviewProduct(product);
    setPreviewModalOpen(true);
  };

  const fetchSavedProducts = async () => {
    try {
      const { data, error } = await getSavedProducts();
      if (!error) setSavedItems(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSavedProducts();
  }, []);

  return (
    <MobileLayout>
      {savedItems?.map((item) => (
        <Box mt={'12px'} key={item?.profile_id}>
          <Typography sx={{ fontFamily: 'Inter', fontWeight: 600, fontSize: '18px', lineHeight: '18px', pl: '24px' }}>
            {item?.profile_title}
          </Typography>
          <Grid container sx={{ rowGap: '1.5vh', columnGap: '1.5vw', padding: '3vw' }}>
            {item?.savedProducts?.map((product) => (
              <Grid
                key={`${product?.link}-${item?.profile_id}`}
                item
                xs={5.9}
                sm={3.8}
                md={2.7}
                lg={1.8}
                sx={{
                  width: '45vw',
                  height: '28vh',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '8px',
                }}
                onClick={() => {
                  handlePreviewOpen(product);
                }}
              >
                <Stack height={'100%'}>
                  <Box height={'75%'} position={'relative'}>
                    <img
                      src={product?.image}
                      height={'100%'}
                      width={'100%'}
                      alt="product"
                      style={{ objectFit: 'contain' }}
                    />
                    <IconButton
                      sx={{ position: 'absolute', top: '0px', right: '0px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Close sx={{ color: 'black', bgcolor: '#d2ff3a38', borderRadius: '50%', p: '2px' }} />
                    </IconButton>
                  </Box>
                  <Box height={'25%'}>
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontWeight: 700,
                        fontSize: '12px',
                        lineHeight: '14px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                      }}
                    >
                      {product?.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontWeight: 400,
                        fontSize: '6px',
                        lineHeight: '17px',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                      }}
                    >
                      {product?.description}
                    </Typography>
                    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                      <Typography sx={{ fontFamily: 'Inter', fontWeight: 700, fontSize: '12px', lineHeight: '17px' }}>
                        {`${getCurrencySymbol(product?.price_currency)} ${product?.price?.toFixed(2)}`}
                      </Typography>
                      <Stack direction={'row'} alignItems={'center'}>
                        <Star sx={{ fontSize: '10px', color: '#f1c506' }} />
                        <Typography
                          sx={{
                            fontFamily: 'Inter',
                            fontWeight: 600,
                            fontSize: '8px',
                            lineHeight: '17px',
                            color: 'rgba(93, 94, 97, 1)',
                            display: 'inline-flex',
                          }}
                        >
                          {product?.rating} / 5
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
      <ProductPreviewModalUser product={previewProduct!} open={previewModalOpen} onClose={handlePreviewClose} />
    </MobileLayout>
  );
};
