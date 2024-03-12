import { String } from 'lodash';
import { SwipeAction, SwipeDirection } from '..';

interface ActionButtonProps {
  action: SwipeAction;
  isCustom?: boolean;
  direction: SwipeDirection;
  onClick: (direction: SwipeDirection, action: SwipeAction) => void;
  extraClass?: string;
  children: any;
}

function CardSwiperActionButton({ direction, isCustom = false, extraClass, action, onClick, children }: ActionButtonProps) {
  const className = `swipe-card__${isCustom ? 'custom-' : ''}action-button ${extraClass}`;

  return (
    <div className={className} id={`swipe-card__${action}-action-button`} onClick={() => onClick(direction, action)}>
      {children}
    </div>
  );
}

export default CardSwiperActionButton;
