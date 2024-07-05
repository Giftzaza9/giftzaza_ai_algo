import { Box, Button, Container, Typography } from '@mui/material';
import { MobileLayout } from '../../components/shared/MobileLayout';
import { Product, Profile } from '../../constants/types';
import { useEffect, useState } from 'react';
import { shopping, shoppingBody } from '../../services/product';
import { loaderState } from '../../store/ShowLoader';
import { observer } from 'mobx-react-lite';
import { CardSwiper } from '../../lib/CardSwpierLib/components/CardSwiper';
import { dummyShoppingProfile, SwipeAction } from '../../constants/constants';
import { SwipeDirection } from '../../lib/CardSwpierLib';
import { useNavigate } from 'react-router-dom';
import { getProfiles } from '../../services/profile';

export const Shopping = observer(() => {
  const { setLoading, loading } = loaderState;
  const navigate = useNavigate();
  const [shoppingProfile, setShoppingProfile] = useState<Partial<Profile>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  // const [limit, setLimit] = useState<number>(30);
  const [prevProducts, setPrevProducts] = useState(new Set());
  const [prevProductsCount, setPrevProductsCount] = useState<number>(1);

  useEffect(() => {
    (async()=>{
      const { data } = await getProfiles({is_shopping_profile: true});
      setShoppingProfile(data?.length > 0 ? data?.[0]: dummyShoppingProfile);
    })()
  },[])
  
  useEffect(() => {
    fetchShoppingProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchShoppingProducts = async () => {
    try {
      setLoading(true);
      const payload: shoppingBody = {
        page,
        limit: 30,
      };
      const { data, error } = await shopping(payload);
      // if (error) toast.error(error || 'Failed to shopping products !');
      if(!error) {
        console.log({ data });
        if(data?.data?.length === 0)
          setProducts([]);
        else {
          setPrevProductsCount(products?.length + 1);
          setProducts((prev) => [...prev, ...data?.data?.map((item: any) => ({ ...item })).reverse()]);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleFinish = (status: SwipeAction) => {
    // if (status) setEvents((prev) => [...prev, `Finish: ${status}`]);
    // alert('Finished ');
    setPage((page) => page + 1);
  };

  const handleProductAction = (direction: SwipeDirection, action: SwipeAction, currentID: string) => {
    // if (action === SwipeAction.SIMILAR) {
    //   fetchSimilarProducts(currentID);
    // } else saveUserActivity(currentID, action);
  };

  console.log({ products });
  return (
    <MobileLayout profile={shoppingProfile as Profile}>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {products !== undefined && products?.length > 0 && (
          <CardSwiper
            type="shopping"
            data={products}
            prevProducts={prevProducts}
            prevProductsCount={prevProductsCount}
            setPrevProducts={setPrevProducts}
            onFinish={handleFinish}
            actionHandler={handleProductAction}
            withActionButtons={true}
            dislikeButton={<button className="">Dislike</button>}
            likeButton={<button className="">Like</button>}
            withRibbons
            likeRibbonText="LIKE"
            dislikeRibbonText="NOPE"
            ribbonColors={{ bgLike: '#4ade80', bgDislike: '#f87171', textColor: 'white' }}
            emptyState={
              <div className="flex flex-col align-center justify-center text-center text-neutral-400 gap-4">
                <p className="leading-5"></p>
              </div>
            }
          />
        )}
        {products?.length === 0 && !loading && prevProductsCount > 1 && (
          <Box
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              rowGap: 2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* <Typography sx={heading}>No more products to show.</Typography> */}
            <Typography
              variant="h5"
              sx={{ fontSize: '22px', fontFamily: 'Inter', lineHeight: '36px', textAlign: 'center', fontWeight: 600 }}
            >
              Meanwhile, we are curating new products for you...
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: '100%', padding: '6px 18px' }}
              onClick={() => {
                navigate('/');
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontFamily: 'Inter', color: 'white', fontSize: '18px', fontWeight: 600, textTransform: 'none' }}
              >
                Try creating new Profile
              </Typography>
            </Button>
          </Box>
        )}
      </Container>
    </MobileLayout>
  );
});
