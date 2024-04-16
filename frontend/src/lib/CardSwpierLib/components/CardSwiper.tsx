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
import { SwipeAction, iphoneSeCondition } from '../../../constants/constants';
import _ from 'lodash';
import { useMediaQuery } from '@mui/material';
import { Bookmark } from '@mui/icons-material';
import ReplayIcon from '@mui/icons-material/Replay';

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
    setPrevProducts,
    prevProducts,
    prevProductsCount,
    refetch,
    setRefetch,
    modelRetrain,
    type,
    productsShowingCount,
    setProductsShowingCount,
  } = props;

  const { handleEnter, handleNewCardSwiper, dynamicData, isFinish, swiperIndex, elements, setElements, handleUserActivity, setIsFinish } =
    useCardSwiper({
      onDismiss,
      onFinish,
      onEnter,
      data,
      actionHandler,
      prevProducts,
      prevProductsCount,
      setProductsShowingCount
    });
  // const [currentSwiper, setCurrentSwiper] = useState<Swiper | undefined>(swiperElements.current[swiperIndex]);
  const isSmallScreen = useMediaQuery(iphoneSeCondition);

  const [currentSwiper, setCurrentSwiper] = useState<Swiper | undefined>(elements[swiperIndex]);
  const [hideActionButtons, setHideActionButtons] = useState('');
  // const [currentProduct, setCurrentProduct] = useState<Product | null>();
  const [cardHeight, setCardHeight] = useState('100%'); // Default height
  const [chromeHeight, setChromeHeight] = useState(0); // Height of browser chrome
  // const [productsShowingCount, setProductsShowingCount] = useState<number>(0);
  
  useEffect(() => {
    // Function to calculate height of browser chrome
    const calculateChromeHeight = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isSafari = userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1;

      let chromeHeight = 0;

      if (isSafari) {
        // For Safari, consider only the bottom UI bar height
        chromeHeight = window.innerHeight - document.documentElement.clientHeight;
      }

      setChromeHeight(chromeHeight);
    };

    // Function to dynamically set card height based on browser
    const setCardHeightByBrowser = () => {
      const viewportHeight = window.innerHeight;
      const cardHeightPercentage = 100 - (chromeHeight / viewportHeight) * 100;
      setCardHeight(`${cardHeightPercentage}%`);
    };

    // Calculate initial height of browser chrome
    calculateChromeHeight();

    // Call the function to set card height
    setCardHeightByBrowser();

    // Add event listener to handle resize
    window.addEventListener('resize', setCardHeightByBrowser);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('resize', setCardHeightByBrowser);
    };
  }, [chromeHeight]);

  useEffect(() => {
    // setCurrentSwiper(swiperElements.current[swiperIndex - 1]);
    setCurrentSwiper(elements[swiperIndex - 1]);
  }, [elements, swiperIndex]);

  useEffect(() => {
    if (refetch) {
      console.log("SETTING REFETCH FALSE");

      if (setRefetch && typeof setRefetch === 'function') setRefetch(false);
      else 
      setElements([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch]);

  useEffect(() => {
    currentSwiper && handleEnter(currentSwiper.element, currentSwiper.meta, currentSwiper.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSwiper]);

  const handleSave = () => {
    handleUserActivity(SwipeDirection.BLANK, SwipeAction.SAVE, false);
  };
  // console.log({ dynamicData });
  console.log({ productsShowingCount });

  useEffect(() => {
    console.log({swiperIndex, prevProductsCount});
    if (swiperIndex === prevProductsCount && onFinish) {
    // if (dynamicData?.length > 0 && productsShowingCount && productsShowingCount === 1 && onFinish) {
      console.log('SETTING ELEMENTS EMPTY ');
      setIsFinish(true);
      setElements([]);
      onFinish(SwipeAction.FINISHED);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swiperIndex]);

  useEffect(() => {
    if (swiperIndex - prevProductsCount! === 3) {
      if (modelRetrain && typeof modelRetrain === 'function')
        try {
          modelRetrain();
        } catch (error) {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swiperIndex]);

  const CardComponents = useMemo(
    () =>
      dynamicData &&
      dynamicData?.length > 0 &&
      dynamicData?.map((product: any, index: number) =>
        product && (
              <div
                key={product?._id + '~' + index}
                ref={(ref: HTMLDivElement | null) =>
                  handleNewCardSwiper(
                    ref,
                    type === 'shopping' ? product?.id : product?.item_id?.id,
                    product?.matching_score,
                    type === 'shopping' ? product : product?.item_id
                  )
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
                    type === 'shopping'
                      ? product?.tags?.map((el: string) => el?.toLowerCase())
                      : product?.item_id?.tags?.map((el: string) => el?.toLowerCase()),
                    profile?.preferences
                  )}
                  productData={type === 'shopping' ? product : product?.item_id}
                  handleSave={handleSave}
                  matchingScore={product?.matching_score}
                  setPrevProducts={setPrevProducts}
                  setProductsShowingCount={setProductsShowingCount}
                />
              </div>
            )
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dynamicData]
  );

  useEffect(() => {
    // if (isFinish ) setHideActionButtons('hide-action-buttons');
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
    <div className="swipe-card" id="swipe-card" style={{ height: cardHeight }}>
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
                direction={SwipeDirection.BLANK}
                action={SwipeAction.REWIND}
                onClick={handleUserActivity}
                extraClass="similarProduct"
              >
                <ReplayIcon sx={{ color: '#85C6E2' }} />
              </CardSwiperActionButton>
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.LEFT}
                action={SwipeAction.DISLIKE}
                onClick={handleUserActivity}
                extraClass="dislikeProduct"
              >
                <GradientClose height={isSmallScreen ? '18' : '24'} />
              </CardSwiperActionButton>
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.RIGHT}
                action={SwipeAction.BUY}
                onClick={handleUserActivity}
                extraClass={'buyProduct'}
              >
                <span style={{ fontSize: isSmallScreen ? '16px' : '21px', fontFamily: 'Inter', fontWeight: '700' }}>
                  BUY
                </span>{' '}
              </CardSwiperActionButton>
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.RIGHT}
                action={SwipeAction.LIKE}
                onClick={handleUserActivity}
                extraClass={'loveProduct'}
              >
                <Love height={isSmallScreen ? '18' : '24'} />
              </CardSwiperActionButton>
              <CardSwiperActionButton
                isCustom
                direction={SwipeDirection.BLANK}
                action={SwipeAction.SAVE}
                onClick={handleUserActivity}
                extraClass="saveProduct"
              >
                <Bookmark sx={{ color: 'rgba(255, 200, 43, 1)' }} />
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
