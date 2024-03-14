import { Container } from '@mui/material';
import { MobileLayout } from '../../components/shared/MobileLayout';
import { CardSwiper } from '../../lib/CardSwpierLib/components/CardSwiper';
import { SwipeDirection } from '../../lib/CardSwpierLib/types/types';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getProfile } from '../../services/profile';
import { toast } from 'react-toastify';
import { Profile } from '../../constants/types';
import { SimilarProductBody, getSimilarProducts } from '../../services/product';
import { SwipeAction } from '../../constants/constants';
import { storeUserActivity, userActivityBody } from '../../services/user';
import { observer } from 'mobx-react-lite';
import { loaderState } from '../../store/ShowLoader';

export const Products = observer(() => {
  const { setLoading } = loaderState;
  const { profileId } = useParams();
  const [products, setProducts] = useState<any>([]);
  const [profile, setProfile] = useState<Profile | undefined>();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProfile(profileId as string);
      if (error) toast.error(error || 'Failed to fetch profile data !');
      else {
        setProfile(data);
        setProducts(data?.recommended_products?.map((item: any) => ({ ...item })).reverse());
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

  const handleFinish = (status: SwipeAction) => {
    // if (status) setEvents((prev) => [...prev, `Finish: ${status}`]);
    alert('Finished ');
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
    console.log({ data });
    if (error) toast.error(error || 'Faild to get similar products !');
    else {
      setProducts((prev: any) => [
        ...prev,
        ...data,
        // ...data?.map((item: any) => ({ ...item })).reverse()
      ]);
    }
  };

  const saveUserActivity = async (product_id: string, activity: SwipeAction) => {
    const payload: userActivityBody = {
      product_id,
      activity,
      profile_id: profileId!,
    };
    const { data, error } = await storeUserActivity(payload);
    console.log({ data, error });
  };

  console.log({ products });

  return (
    <MobileLayout profile={profile} fetchProfile={fetchProfile}>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {products !== undefined && products?.length > 0 && (
          <CardSwiper
            data={products}
            profile={profile}
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
                <p className="leading-5">
                  You've reached the <br /> end of the list
                </p>
              </div>
            }
          />
        )}
      </Container>
    </MobileLayout>
  );
});
