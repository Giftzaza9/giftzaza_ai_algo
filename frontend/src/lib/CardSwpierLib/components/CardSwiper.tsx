import '../main.css';

import { useEffect, useMemo, useState } from 'react';
import { useCardSwiper } from '../hooks/useCardSwiper';
import { CardSwiperProps, SwipeDirection } from '../types/types';
import { Swiper } from '../utils/swiper';
import CardSwiperActionButton from './CardSwiperActionButton';
import CardSwiperEmptyState from './CardSwiperEmptyState';
import CardSwiperRibbons from './CardSwiperRibbons';
import { ProductCard } from '../../../components/product/ProductCardUser';
import CloseIcon from '@mui/icons-material/Close';
import { GradientClose } from '../../../components/shared/Icons/GradientClose';
import { Love } from '../../../components/shared/Icons/Love';
import { Save } from '../../../components/shared/Icons/Save';
import { SwipeAction } from '../../../constants/constants';
import { Product } from '../../../constants/types';
import _ from 'lodash';

export const CardSwiper = (props: CardSwiperProps) => {
  const {
    data,
    likeButton,
    dislikeButton,
    withActionButtons = false,
    emptyState,
    onDismiss,
    onFinish,
    onEnter,
    actionHandler,
    profile,
  } = props;

  const { handleEnter, handleClickEvents, handleNewCardSwiper, dynamicData, isFinish, swiperIndex, swiperElements } =
    useCardSwiper({
      onDismiss,
      onFinish,
      onEnter,
      data,
    });
  const [currentSwiper, setCurrentSwiper] = useState<Swiper | undefined>(swiperElements.current[swiperIndex]);
  const [hideActionButtons, setHideActionButtons] = useState('');
  const [currentProduct, setCurrentProduct] = useState<Product | null>();

  useEffect(() => {
    setCurrentSwiper(swiperElements.current[swiperIndex - 1]);
  }, [swiperElements, swiperIndex]);

  useEffect(() => {
    currentSwiper && handleEnter(currentSwiper.element, currentSwiper.meta, currentSwiper.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSwiper]);

  useEffect(() => {
    if (swiperElements?.current) {
      setCurrentProduct(swiperElements.current[swiperIndex - 1]?.product as unknown as Product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swiperElements?.current, swiperIndex]);

  const CardComponents = useMemo(
    () =>
      dynamicData &&
      dynamicData?.length > 0 &&
      dynamicData?.map(
        (product: any, index: number) =>
          product && (
            <div
              key={product?._id + '~' + index}
              ref={(ref: HTMLDivElement | null) =>
                handleNewCardSwiper(ref, product?.item_id?.id, product?.matching_score, product?.item_id)
              }
              className="swipe-card__container"
              id="swipe-card__container"
            >
              {props.withRibbons && (
                <CardSwiperRibbons
                  likeRibbonText={props.likeRibbonText}
                  dislikeRibbonText={props.dislikeRibbonText}
                  ribbonColors={props.ribbonColors}
                />
              )}
              <ProductCard
                matches={_.intersection(
                  product?.item_id?.tags?.map((el: string) => el?.toLowerCase()),
                  profile?.preferences
                )}
                productData={product}
              />
            </div>
          )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dynamicData]
  );

  useEffect(() => {
    if (isFinish) setHideActionButtons('hide-action-buttons');
  }, [isFinish]);

  useEffect(() => {
    const handleWindowBlur = () => {
      currentSwiper?.handleTouchEnd();
      currentSwiper?.handleMoveUp();
    };

    window.addEventListener('blur', handleWindowBlur);

    return () => window.removeEventListener('blur', handleWindowBlur);
  }, [currentSwiper]);

  const handleUserActivity = (direction: SwipeDirection, action: SwipeAction) => {
    actionHandler(direction, action, currentProduct?.id);
    if (action === SwipeAction.BUY) {
      window.open(currentProduct?.link, '_blank');
    } else handleClickEvents(direction, action, currentProduct?.id as string);
  };

  return (
    <div className="swipe-card" id="swipe-card">
      <div className="swipe-card__cards" id="swipe-card__cards">
        {CardComponents}
        {emptyState && isFinish && <CardSwiperEmptyState children={emptyState} isFinish={isFinish} />}
      </div>
      {withActionButtons && (
        <div className={`swipe-card__children ${hideActionButtons}`} id="swipe-card__children">
          {likeButton && dislikeButton ? (
            <>
              {/* <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.SIMILAR}
                action={SwipeAction.SIMILAR}
                onClick={actionHandler}
                extraClass="similarProduct"
              >
                <Similar />
              </CardSwiperActionButton> */}
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.LEFT}
                action={SwipeAction.DISLIKE}
                onClick={handleUserActivity}
                extraClass="dislikeProduct"
              >
                <GradientClose />
              </CardSwiperActionButton>
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.RIGHT}
                action={SwipeAction.BUY}
                onClick={handleUserActivity}
                extraClass={'buyProduct'}
              >
                <span style={{ fontSize: '21px', fontFamily: 'Inter', fontWeight: '700' }}>BUY</span>{' '}
              </CardSwiperActionButton>
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.RIGHT}
                action={SwipeAction.LIKE}
                onClick={handleUserActivity}
                extraClass={'loveProduct'}
              >
                <Love />
              </CardSwiperActionButton>
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.RIGHT}
                action={SwipeAction.LIKE}
                onClick={handleUserActivity}
                extraClass="saveProduct"
              >
                <Save />
              </CardSwiperActionButton>
            </>
          ) : (
            <>
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.LEFT}
                action={SwipeAction.DISLIKE}
                onClick={handleUserActivity}
              >
                <CloseIcon sx={{ fontSize: '50px' }} />{' '}
              </CardSwiperActionButton>
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.RIGHT}
                action={SwipeAction.LIKE}
                onClick={handleUserActivity}
              >
                <CloseIcon sx={{ fontSize: '50px' }} />{' '}
              </CardSwiperActionButton>
            </>
          )}
        </div>
      )}
    </div>
  );
};
