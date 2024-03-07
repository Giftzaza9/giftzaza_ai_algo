import { Container } from '@mui/material';
import { MobileLayout } from '../../components/shared/MobileLayout';
import { CardSwiper } from '../../lib/CardSwpierLib/components/CardSwiper';
import { SwipeAction } from '../../lib/CardSwpierLib/types/types';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { useParams } from 'react-router';

export const mockData = [
  {
    id: 'da9a32c7e',
    meta: { apk: 'some-apk-d.apk' },
    src: 'https://images.bloomingdalesassets.com/is/image/BLM/products/2/optimized/12956852_fpx.tif?op_sharpen=1&wid=700&fit=fit,1&$filtersm$',
    source: 'bloomingdale',
    title: 'Sam Edelman Womens Bianka Slingback Kitten Heels',
    description:
      'sam edelman womens bianka slingback kitten heels fits true to size order your normal size pointed toe buckled slingback 225 selfcovered heel leather upper.',
  },
  {
    id: 'fc7e0bd4',
    meta: { apk: 'some-apk-b.apk' },
    src: 'https://images.bloomingdalesassets.com/is/image/BLM/products/0/optimized/10977650_fpx.tif?op_sharpen=1&wid=700&fit=fit,1&$filtersm$',
    source: 'amazon',
    title: 'Valentino Garavani Womens Rockstud Cage Leather Pumps with Studs',
    description:
      'valentino garavani womens rockstud cage leather pumps with studs fits small order a half size up pointed toe buckled ankle strap geometric stud detailing at. ',
  },
  {
    id: 'da9a7067',
    meta: { apk: 'some-apk-c.apk' },
    src: 'https://images.bloomingdalesassets.com/is/image/BLM/products/6/optimized/13129996_fpx.tif?op_sharpen=1&wid=700&fit=fit,1&$filtersm$',
    source: 'bloomingdale',
    title: 'AQUA Cire Wonder Short Puffer Jacket',
    description:
      'aqua cire wonder short puffer jacket stand collar with attached hood long sleeves with elasticized cuffs front zip with snap button closure flap patch pockets lined.',
  },
  {
    id: 'da9afc7e',
    meta: { apk: 'some-apk-d.apk' },
    src: 'https://images.bloomingdalesassets.com/is/image/BLM/products/0/optimized/11759730_fpx.tif?op_sharpen=1&wid=700&fit=fit,1&$filtersm$',
    source: 'amazon',
    title: 'WOLF Caroline Medium Jewelry Case',
    description:
      'wolf caroline medium jewelry case dimensions 115l x 85w x 7h the embodiment of sophistication and style caroline a timeless classic with elegant soft lines of the 50s supple.',
  },
  {
    id: '88552078',
    meta: { apk: 'some-apk-a.apk' },
    src: 'https://images.bloomingdalesassets.com/is/image/BLM/products/7/optimized/12960927_fpx.tif?op_sharpen=1&wid=700&fit=fit,1&$filtersm$',
    source: 'amazon',
    title: 'Aura Carver Digital Picture Frame Digital Picture Frame',
    description:
      'aura carver digital picture frame a wificonnected photo frame that makes it easy to instantly display and share all your favorite photos videos and more display size 10 landscape.',
  },
];

export const Products = () => {
  const { profileId } = useParams();
  console.log({ profileId });
  const handleFinish = (status: SwipeAction) => {
    // if (status) setEvents((prev) => [...prev, `Finish: ${status}`]);
    alert('Finished ');
  };

  return (
    <MobileLayout>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <CardSwiper
          data={mockData}
          onFinish={handleFinish}
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
      </Container>
    </MobileLayout>
  );
};
