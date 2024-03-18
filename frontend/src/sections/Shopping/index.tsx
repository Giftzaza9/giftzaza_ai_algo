import { Container } from '@mui/material';
import { MobileLayout } from '../../components/shared/MobileLayout';
import { Product } from '../../constants/types';
import { useEffect, useState } from 'react';
import { shopping, shoppingBody } from '../../services/product';
import { loaderState } from '../../store/ShowLoader';
import { observer } from 'mobx-react-lite';
import { toast } from 'react-toastify';
import { CardSwiper } from '../../lib/CardSwpierLib/components/CardSwiper';
import { SwipeAction } from '../../constants/constants';
import { SwipeDirection } from '../../lib/CardSwpierLib';

export const Shopping = observer(() => {
  const { setLoading } = loaderState;
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(50);
  const [prevProducts, setPrevProducts] = useState(new Set());
  const [prevProductsCount, setPrevProductsCount] = useState<number>(1);

  useEffect(() => {
    fetchShoppingProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchShoppingProducts = async () => {
    try {
      setLoading(true);
      const payload: shoppingBody = {
        page,
        limit,
      };
      const { data, error } = await shopping(payload);
      if (error) toast.error(error || 'Failed to shopping products !');
      else {
        console.log({ data });
        setPrevProductsCount(products?.length + 1);
        setProducts((prev) => [...prev, ...data?.data?.map((item: any) => ({ ...item })).reverse()]);
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
    <MobileLayout>
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
      </Container>
    </MobileLayout>
  );
});
