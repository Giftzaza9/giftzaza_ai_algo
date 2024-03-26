import { Box, Button, Container, Typography } from '@mui/material';
import { MobileLayout } from '../../components/shared/MobileLayout';
import { CardSwiper } from '../../lib/CardSwpierLib/components/CardSwiper';
import { SwipeDirection } from '../../lib/CardSwpierLib/types/types';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getProfile } from '../../services/profile';
import { toast } from 'react-toastify';
import { Product, Profile } from '../../constants/types';
import { SimilarProductBody, getSimilarProducts, moreProductBody, moreProducts } from '../../services/product';
import { SwipeAction } from '../../constants/constants';
import { storeUserActivity, userActivityBody } from '../../services/user';
import { observer } from 'mobx-react-lite';
import { loaderState } from '../../store/ShowLoader';
import { retrain } from '../../services/AI';
import { useNavigate } from 'react-router-dom';

export const Products = observer(() => {
  const { setLoading } = loaderState;
  const { profileId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [prevProducts, setPrevProducts] = useState(new Set());
  const [prevProductsCount, setPrevProductsCount] = useState<number>(1);
  const [profile, setProfile] = useState<Profile | undefined>();
  const [page, setPage] = useState<number>(1);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [haveMoreProducts, setHaveMoreProducts] = useState<boolean>(true);
  const [moreProductsCase, setMoreProductsCase] = useState<number>(1);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProfile(profileId as string);
      if (error) toast.error(error || 'Failed to fetch profile data !');
      else {
        setProfile(data);
        setProducts((prev) => [...prev, ...data?.recommended_products?.map((item: any) => ({ ...item })).reverse()]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  useEffect(() => {
    if (refetch) fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  const handleFinish = (status: SwipeAction) => {
    // if (status) setEvents((prev) => [...prev, `Finish: ${status}`]);
    // alert('Finished ');
    setPage((page) => page + 1);
  };

  const handleProductAction = (direction: SwipeDirection, action: SwipeAction, currentID: string) => {
    if (action === SwipeAction.SIMILAR) {
      fetchSimilarProducts(currentID);
    } else saveUserActivity(currentID, action);
  };

  const fetchSimilarProducts = async (productId: string) => {
    const payload: SimilarProductBody = {
      item_id: productId,
      top_n: 10,
    };
    const { data, error } = await getSimilarProducts(payload);
    if (error) toast.error(error || 'Faild to get similar products !');
    else {
      setProducts((prev: any) => [
        ...prev,
        ...data,
        // ...data?.map((item: any) => ({ ...item })).reverse()
      ]);
    }
  };

  const fetchMoreProducts = async (curPage: number, payload: moreProductBody) => {
    // setLoading(true);
    const { data, error } = await moreProducts(payload);
    console.log({ data });
    if (error) toast.error(error || 'Faild to fetch more products !');
    else {
      
      setPrevProductsCount(products?.length + 1);
      const prevIds = new Set(products.map((item: any) => item.item_id?.id));
        // Filter out items from data that are not already present in prev
      const uniqueNewProducts = data?.filter((item: any) => !prevIds.has(item.item_id?.id));

      if (uniqueNewProducts?.length === 0 && moreProductsCase < 3) {
        setMoreProductsCase((prev) => prev + 1);
        return ;
      }
      console.log({moreProductsCase, uniqueNewProducts})
      if (moreProductsCase === 3 && uniqueNewProducts?.length === 0) {
        setHaveMoreProducts(uniqueNewProducts?.length > 0 ? true : false);
        setProducts([]);
        return ;
      }

      setProducts((prev: any) => {
        return [...prev, ...(uniqueNewProducts || []).reverse()];
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    const payload: moreProductBody = {
      preferences: profile?.preferences!,
      top_n: page * 10,
      semi_soft_filter: ["interest"],
    };

    if (page > 1 && moreProductsCase < 4) {

      let newPayload = {...payload};
      if(moreProductsCase === 1) {
        newPayload = {
          ...payload,
          min_price: profile?.min_price ?? 0,
          max_price: profile?.max_price ?? 0,
        }
      }
      else if(moreProductsCase === 3) {
        newPayload = {
          ...payload,
          semi_soft_filter: [],
        }
      }

      fetchMoreProducts(page, newPayload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, moreProductsCase]);

  const saveUserActivity = async (product_id: string, activity: SwipeAction) => {
    if ([SwipeAction.FINISHED, SwipeAction.SIMILAR].includes(activity)) return;
    const payload: userActivityBody = {
      product_id,
      activity,
      profile_id: profileId!,
    };
    const { data, error } = await storeUserActivity(payload);
    if (data?.activity === SwipeAction.SAVE) toast.success('Product saved successfully', { autoClose: 1000 });
    console.log({ data, error });
  };

  const modelRetrain = () => {
    retrain();
  };

  return (
    <MobileLayout
      profile={profile}
      fetchProfile={() => {
        setRefetch(true);
      }}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {products !== undefined && products?.length > 0 && (
          <CardSwiper
            type="product"
            profile={profile}
            modelRetrain={modelRetrain}
            refetch={refetch}
            setRefetch={setRefetch}
            data={products}
            prevProducts={prevProducts}
            prevProductsCount={prevProductsCount}
            setPrevProducts={setPrevProducts}
            onFinish={handleFinish}
            actionHandler={handleProductAction}
            // onDismiss={handleSwipe}
            withActionButtons={true}
            dislikeButton={<button className="">Dislike</button>}
            likeButton={<button className="">Like</button>}
            withRibbons
            likeRibbonText="LIKE"
            dislikeRibbonText="NOPE"
            ribbonColors={{ bgLike: '#4ade80', bgDislike: '#f87171', textColor: 'white' }}
            emptyState={
              <div className="flex flex-col align-center justify-center text-center text-neutral-400 gap-4">
                <p className="leading-5">{/* You've reached the <br /> end of the list */}</p>
              </div>
            }
          />
        )}
        {!haveMoreProducts && (
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
              sx={{ fontSize: '24px', fontFamily: 'Inter', lineHeight: '36px', textAlign: 'center', fontWeight: 600 }}
            >
              Meanwhile, we are curating new products for you...
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: '100%', padding: '6px 18px' }}
              onClick={() => {
                setHaveMoreProducts(true);
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
