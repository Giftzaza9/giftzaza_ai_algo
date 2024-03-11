import '../main.css';

import { useEffect, useMemo, useState } from 'react';
import { useCardSwiper } from '../hooks/useCardSwiper';
import { CardSwiperProps, SwipeAction, SwipeDirection } from '../types/types';
import { Swiper } from '../utils/swiper';
import CardSwiperActionButton from './CardSwiperActionButton';
import CardSwiperEmptyState from './CardSwiperEmptyState';
import CardSwiperRibbons from './CardSwiperRibbons';
import { ProductCard } from '../../../sections/Products/ProductCard';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';

export const CardSwiper = (props: CardSwiperProps) => {
  const { data, likeButton, dislikeButton, withActionButtons = false, emptyState, onDismiss, onFinish, onEnter } = props;
  const { handleEnter, handleClickEvents, handleNewCardSwiper, dynamicData, isFinish, swiperIndex, swiperElements } =
    useCardSwiper({
      onDismiss,
      onFinish,
      onEnter,
      data,
    });
  const [currentSwiper, setCurrentSwiper] = useState<Swiper | undefined>(swiperElements.current[swiperIndex]);
  const [hideActionButtons, setHideActionButtons] = useState('');

  useEffect(() => {
    setCurrentSwiper(swiperElements.current[swiperIndex - 1]);
  }, [swiperElements, swiperIndex]);

  useEffect(() => {
    currentSwiper && handleEnter(currentSwiper.element, currentSwiper.meta, currentSwiper.id);
  }, [currentSwiper]);
  console.log('dynamicData ', dynamicData);
  const CardComponents = useMemo(
    () =>
      dynamicData.map((product: any) => (
        <div
          key={product?._id}
          ref={(ref: HTMLDivElement | null) => handleNewCardSwiper(ref, product?._id, product?.matching_score)}
          className="swipe-card__container"
          id="swipe-card__container"
        >
          {/* {header && (
            <div className="swipe-card__header-container" id="swipe-card__header-container">
              <h2 id="swipe-card__header">{header}</h2>
            </div>
          )} */}
          {props.withRibbons && (
            <CardSwiperRibbons
              likeRibbonText={props.likeRibbonText}
              dislikeRibbonText={props.dislikeRibbonText}
              ribbonColors={props.ribbonColors}
            />
          )}

          {/* <div className="swipe-card__image-container">
            <img className="swipe-card__image" src={src} alt={src} id="swipe-card__image" />
          </div> */}
          {/* {content && <div className="swipe-card__content">{content}</div>} */}
          <ProductCard
            // ref={(ref: HTMLDivElement | null) => handleNewCardSwiper(ref, product?.id, product?.meta)}
            productData={product}
          />
        </div>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.LEFT}
                action={SwipeAction.DISLIKE}
                onClick={handleClickEvents}
                buttonContent={dislikeButton}
              >
                <CloseIcon sx={{ fontSize: '50px' }} />{' '}
              </CardSwiperActionButton>
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.RIGHT}
                action={SwipeAction.BUY}
                onClick={handleClickEvents}
                buttonContent={likeButton}
                extraClass={'buyProduct'}
              >
                <span style={{ fontSize: '25px', fontFamily: 'Inter', fontWeight: '700' }}>BUY</span>{' '}
              </CardSwiperActionButton>
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.RIGHT}
                action={SwipeAction.LIKE}
                onClick={handleClickEvents}
                buttonContent={likeButton}
                extraClass={'loveProduct'}
              >
                <FavoriteIcon sx={{ fontSize: '50px' }} />{' '}
              </CardSwiperActionButton>
            </>
          ) : (
            <>
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.LEFT}
                action={SwipeAction.DISLIKE}
                onClick={handleClickEvents}
                buttonContent={dislikeButton}
              >
                <CloseIcon sx={{ fontSize: '50px' }} />{' '}
              </CardSwiperActionButton>
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.RIGHT}
                action={SwipeAction.LIKE}
                onClick={handleClickEvents}
                buttonContent={likeButton}
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
