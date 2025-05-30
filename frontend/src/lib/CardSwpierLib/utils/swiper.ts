import { SwipeAction } from '../../../constants/constants';
import { Product } from '../../../constants/types';
import { CardEnterEvent, CardEvent, CardId, CardMetaData, SwipeOperation, SwiperProps } from '../types/types';

interface StartPoint {
  x: number;
  y: number;
}

export class Swiper implements SwiperProps {
  element: HTMLDivElement;
  id: CardId;
  product: Product;
  meta: CardMetaData;
  onDismiss?: CardEvent;
  swiperElements: any;

  constructor({ element, id, meta, onDismiss, swiperElements, product }: SwiperProps) {
    this.id = id;
    this.meta = meta;
    this.element = element;
    this.onDismiss = onDismiss;
    this.swiperElements = swiperElements;
    this.product = product;

    this.init();
  }
  onFinish?: ((status: SwipeAction.FINISHED) => void) | undefined;
  onEnter?: CardEnterEvent | undefined;

  // private properties
  private startPoint: StartPoint | null = { x: 0, y: 0 };
  private offsetX = 0;
  private offsetY = 0;

  private isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  private init = () => {
    if (this.isTouchDevice()) {
      this.listenToTouchEvents();
    } else {
      this.listenToMouseEvents();
    }
  };

  private listenToTouchEvents = () => {
    this.element.addEventListener('touchstart', (e) => {
      const touch = e.changedTouches[0];
      if (!touch) return;
      const { clientX, clientY } = touch;
      this.startPoint = { x: clientX, y: clientY };
      document.addEventListener('touchmove', this.handleTouchMove);
      this.element.style.transition = 'transform 0s';
    });

    document.addEventListener('touchend', this.handleTouchEnd);
    document.addEventListener('cancel', this.handleTouchEnd);
  };

  private listenToMouseEvents = () => {
    this.element.addEventListener('mousedown', (e) => {
      const { clientX, clientY } = e;
      this.startPoint = { x: clientX, y: clientY };
      document.addEventListener('mousemove', this.handleMouseMove);
      this.element.style.transition = 'transform 0s';
    });

    document.addEventListener('mouseup', this.handleMoveUp);

    // prevent card from being dragged
    this.element.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });
  };

  private handleMove = (x: number, _y: number) => {
    if (!this.startPoint) return;
    this.showRibbons();

    this.offsetX = x - this.startPoint.x;
    const rotate = this.offsetX * 0.07;
    this.element.style.transform = `translate(${this.offsetX}px,0) rotate(${rotate}deg)`;
    // dismiss card
    if (Math.abs(this.offsetX) > this.element.clientWidth * 0.4) {
      this.dismiss(this.offsetX > 0 ? 1 : -1);
    }
  };

  private showRibbons = () => {
    const ribbonLike = this.element.querySelector('.swipe-card__ribbon-like');
    const ribbonDislike = this.element.querySelector('.swipe-card__ribbon-dislike');
    const dislikeButton: any = document.getElementById('swipe-card__dislike-action-button');
    const likeButton: any = document.getElementById('swipe-card__like-action-button');
    console.log({dislikeButton});
    if (this.offsetX > 10) {
      ribbonLike?.classList?.add('show');
      ribbonDislike?.classList?.remove('show');
      likeButton?.classList?.add('liked');
      dislikeButton?.classList?.remove('disliked');
      document.getElementById('like1')?.setAttribute('stop-color', '#FFFFFF')
      document.getElementById('like2')?.setAttribute('stop-color', '#FFFFFF')
      document.getElementById('close1')?.setAttribute('stop-color', '#EA4080')
      document.getElementById('close2')?.setAttribute('stop-color', '#EE805F')
    } else if (this.offsetX < -10) {
      ribbonLike?.classList?.remove('show');
      ribbonDislike?.classList?.add('show');
      likeButton?.classList?.remove('liked');
      dislikeButton?.classList?.add('disliked');
      document.getElementById('close1')?.setAttribute('stop-color', '#FFFFFF')
      document.getElementById('close2')?.setAttribute('stop-color', '#FFFFFF')
      document.getElementById('like1')?.setAttribute('stop-color', '#6DE5B5')
      document.getElementById('like2')?.setAttribute('stop-color', '#73ECDD')
    } else {
      ribbonLike?.classList?.remove('show');
      ribbonDislike?.classList?.remove('show');
      likeButton?.classList?.remove('liked');
      dislikeButton?.classList?.remove('disliked');
      document.getElementById('close1')?.setAttribute('stop-color', '#EA4080')
      document.getElementById('close2')?.setAttribute('stop-color', '#EE805F')
      document.getElementById('like1')?.setAttribute('stop-color', '#6DE5B5')
      document.getElementById('like2')?.setAttribute('stop-color', '#73ECDD')
    }
  };

  private hideRibbons = () => {
    const ribbonLike = this.element.querySelector('.swipe-card__ribbon-like');
    const ribbonDislike = this.element.querySelector('.swipe-card__ribbon-dislike');

    ribbonLike?.classList?.remove('show');
    ribbonDislike?.classList?.remove('show');
  };

  // mouse event handlers
  private handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    if (!this.startPoint) return;
    const { clientX, clientY } = e;
    this.handleMove(clientX, clientY);
  };

  handleMoveUp = () => {
    this.startPoint = null;
    document.removeEventListener('mousemove', this.handleMouseMove);
    this.element.style.transform = '';
    this.element.style.transition = 'all .5s';
    this.hideRibbons();
  };

  // touch event handlers
  private handleTouchMove = (e: TouchEvent) => {
    if (!this.startPoint) return;
    const touch = e.changedTouches[0];
    if (!touch) return;
    const { clientX, clientY } = touch;
    this.handleMove(clientX, clientY);
  };

  handleTouchEnd = () => {
    this.startPoint = null;
    document.removeEventListener('touchmove', this.handleTouchMove);
    this.element.style.transform = '';
    this.element.style.transition = 'all .5s';
    this.hideRibbons();
  };

  private dismiss = (direction: number, swipeOperation: SwipeOperation = SwipeOperation.SWIPE) => {
    this.startPoint = null;
    document.removeEventListener('mouseup', this.handleMoveUp);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('touchend', this.handleTouchEnd);
    document.removeEventListener('touchmove', this.handleTouchMove);
    this.element.style.transition = 'all 0.6s';
    this.element.style.transform = `translate(${direction * window.innerWidth * 2}px, ${this.offsetY}px) rotate(${
      60 * direction
    }deg)`;
    this.element.classList.add('dismissing');
    setTimeout(() => this?.element?.remove(), 300);
    // setTimeout(() => {
    //   if (this.element) {
    //     this.element.style.display = 'none';
    //   }
    // }, 300);
    document.getElementById('close1')?.setAttribute('stop-color', '#EA4080')
    document.getElementById('close2')?.setAttribute('stop-color', '#EE805F')
    document.getElementById('like1')?.setAttribute('stop-color', '#6DE5B5')
    document.getElementById('like2')?.setAttribute('stop-color', '#73ECDD')
    document.getElementById('swipe-card__dislike-action-button')?.classList?.remove('disliked');;
    document.getElementById('swipe-card__like-action-button')?.classList?.remove('liked');;
    if (typeof this.onDismiss === 'function') {
      const swipeDirection = direction === 1 ? SwipeAction.LIKE : SwipeAction.DISLIKE;
      this.onDismiss(this.element, this.meta, this.id, swipeDirection, swipeOperation);
    }
  };

  dismissById = (direction: number) => {
    this.dismiss(direction, SwipeOperation.CLICK);
  };

  rewind = (lastSwipedCard: HTMLDivElement) => {
    if (!lastSwipedCard) return; // If there are no swiped cards, return
    lastSwipedCard.classList.remove('dismissing');
    var swipeCardParent = document.getElementById('swipe-card__cards');
    swipeCardParent?.appendChild(lastSwipedCard);
    // lastSwipedCard.style.display = 'block';
    setTimeout(() => {
      lastSwipedCard.style.transition = 'all 0.6s';
      lastSwipedCard.style.transform = `translate(0, 0) rotate(0deg)`;
    }, 100);
  };
}
