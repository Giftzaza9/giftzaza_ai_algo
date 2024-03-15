import { useEffect, useRef, useState } from 'react';
import { CardData, CardEnterEvent, CardEvents, CardId, CardMetaData, SwipeDirection, SwipeOperation } from '../types/types';
import { Swiper } from '../utils/swiper';
import { SwipeAction } from '../../../constants/constants';
import { Product } from '../../../constants/types';

interface UseCardSwiper extends CardEvents {
  data: CardData[];
  actionHandler: any;
  prevProducts: any;
  prevProductsCount?: number;
}

export const useCardSwiper = ({
  onDismiss,
  onFinish,
  onEnter,
  data,
  actionHandler,
  prevProducts,
  prevProductsCount,
}: UseCardSwiper) => {
  const swiperElements = useRef<Swiper[]>([]);
  const [swiperIndex, setSwiperIndex] = useState(data?.length);
  const [dynamicData, setDynamicData] = useState(data);
  const [isFinish, setIsFinish] = useState(false);
  const [elements, setElements] = useState<Swiper[]>([]);
  const currentProductRef = useRef<Product | null>(null);

  useEffect(() => {
    // Update dynamicData when data changes
    if (data && data?.length > 0) {
      console.log('USE EFFECT WORKING ', data);
      swiperElements.current = [];
      setDynamicData(data);
      setSwiperIndex(data?.length);
      setIsFinish(false);
    }
  }, [data]);

  console.log({ swiperIndex });
  console.log({ elements });
  console.log('CURR PROD ', currentProductRef.current);
  const handleNewCardSwiper = (ref: HTMLDivElement | null, id: CardId, meta: CardMetaData, product: Product) => {
    if (ref) {
      const currentSwiper = new Swiper({ element: ref, id, meta, onDismiss: handleDismiss, swiperElements, product });
      swiperElements.current.push(currentSwiper);
      setElements((pre) => {
        return [...pre, currentSwiper];
      });
    }
  };

  const handleEnter: CardEnterEvent = (element, meta, id) => {
    onEnter && onEnter(element, meta, id);
  };

  const handleDismiss = (
    element: HTMLDivElement,
    meta: CardMetaData,
    id: CardId,
    action: SwipeAction,
    operation: SwipeOperation
  ) => {
    setSwiperIndex((prev) => prev - 1);
    onDismiss && onDismiss(element, meta, id, action, operation);
    // swiperElements.current.pop();
    // setElements((prevElement) => {
    //   const newArray = [...prevElement];
    //   newArray.pop();
    //   return newArray;
    // });
    handleUserActivity(SwipeDirection.BLANK, action, true);
  };

  const handleClickEvents = (direction: SwipeDirection, action: SwipeAction, currentID: string) => {
    if (swiperIndex && direction !== SwipeDirection.BLANK) {
      // const swiper = swiperElements.current[swiperIndex - 1];
      const swiper = elements[swiperIndex - 1];
      swiper?.dismissById(direction);
    }
  };

  const handleUserActivity = (direction: SwipeDirection, action: SwipeAction, callAction: Boolean) => {
    if (callAction) actionHandler(direction, action, currentProductRef.current?.id);
    if (action === SwipeAction.BUY) {
      actionHandler(direction, action, currentProductRef.current?.id);
      window.open(currentProductRef.current?.link, '_blank');
    } else handleClickEvents(direction, action, currentProductRef.current?.id as string);
  };

  useEffect(() => {
    if (swiperIndex === prevProductsCount && onFinish) {
      setIsFinish(true);
      console.log('SETTING ELEMENTS EMPTY ');
      setElements([]);
      onFinish(SwipeAction.FINISHED);
    }
  }, [swiperIndex]);

  useEffect(() => {
    if (elements) {
      currentProductRef.current = elements[swiperIndex - 1]?.product as unknown as Product;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elements, swiperIndex]);

  return {
    isFinish,
    dynamicData,
    swiperIndex,
    swiperElements,
    elements,
    setElements,
    handleEnter,
    setDynamicData,
    handleClickEvents,
    handleNewCardSwiper,
    handleUserActivity,
  };
};
