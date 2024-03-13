import { useEffect, useRef, useState } from 'react';
import {
  CardData,
  CardEnterEvent,
  CardEvents,
  CardId,
  CardMetaData,
  SwipeDirection,
  SwipeOperation,
} from '../types/types';
import { Swiper } from '../utils/swiper';
import { SwipeAction } from '../../../constants/constants';
import { Product } from '../../../constants/types';

interface UseCardSwiper extends CardEvents {
  data: CardData[];
}

export const useCardSwiper = ({ onDismiss, onFinish, onEnter, data }: UseCardSwiper) => {
  const swiperElements = useRef<Swiper[]>([]);
  const [swiperIndex, setSwiperIndex] = useState(data?.length);
  const [dynamicData, setDynamicData] = useState(data);
  const [isFinish, setIsFinish] = useState(false);

  useEffect(() => {
    // Update dynamicData when data changes
    if (data && data?.length > 0) {
      console.log('UPDATING STATES');
      swiperElements.current = [];
      setDynamicData(data);
      setSwiperIndex(data?.length);
      setIsFinish(false);
    }
  }, [data]);

  const handleNewCardSwiper = (ref: HTMLDivElement | null, id: CardId, meta: CardMetaData, product: Product) => {
    if (ref) {
      const currentSwiper = new Swiper({ element: ref, id, meta, onDismiss: handleDismiss, swiperElements, product });
      swiperElements.current.push(currentSwiper);
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
    swiperElements.current.pop();
  };

  const handleClickEvents = (direction: SwipeDirection, action: SwipeAction, currentID: string) => {
    if (swiperIndex && direction !== SwipeDirection.BLANK) {
      const swiper = swiperElements.current[swiperIndex - 1];
      swiper?.dismissById(direction);
    }
  };

  useEffect(() => {
    if (!swiperIndex && onFinish) {
      setIsFinish(true);
      onFinish(SwipeAction.FINISHED);
    }
  }, [swiperIndex]);

  return {
    isFinish,
    dynamicData,
    swiperIndex,
    swiperElements,
    handleEnter,
    setDynamicData,
    handleClickEvents,
    handleNewCardSwiper,
  };
};
