import { Container } from '@mui/material';
import { MobileLayout } from '../../components/shared/MobileLayout';
import { CardSwiper } from '../../lib/CardSwpierLib/components/CardSwiper';
import { SwipeAction, SwipeDirection } from '../../lib/CardSwpierLib/types/types';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getProfile } from '../../services/profile';
import { toast } from 'react-toastify';

export const Products = () => {
  const { profileId } = useParams();
  const [profileData, setProfileData] = useState<any>();
  console.log({ profileId });

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const fetchProfile = async () => {
    const { data, error } = await getProfile(profileId as string);
    if (error) toast.error(error || 'Failed to fetch profile data !');
    else {
      console.log({ data });
      setProfileData(data);
    }
  };

  console.log('PROFILE DATA ', profileData?.recommended_products);

  const handleFinish = (status: SwipeAction) => {
    // if (status) setEvents((prev) => [...prev, `Finish: ${status}`]);
    alert('Finished ');
  };

  const handleProductAction = (direction: SwipeDirection, action: SwipeAction) => {
    alert(action);
  }

  return (
    <MobileLayout>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {profileData?.recommended_products?.length > 0 && (
          <CardSwiper
            data={profileData?.recommended_products}
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
};
