import { String } from 'lodash';
import { SwipeDirection } from '..';
import { SwipeAction } from '../../../constants/constants';

interface ActionButtonProps {
  action: SwipeAction;
  isCustom?: boolean;
  direction: SwipeDirection;
  onClick: (direction: SwipeDirection, action: SwipeAction, callAction: Boolean) => void;
  extraClass?: string;
  children: any;
}

function CardSwiperActionButton({ direction, isCustom = false, extraClass, action, onClick, children }: ActionButtonProps) {
  const className = `swipe-card__${isCustom ? 'custom-' : ''}action-button ${extraClass}`;

  return (
    <div className={className} id={`swipe-card__${action}-action-button`} onClick={() => onClick(direction, action, false)}>
      {children}
    </div>
  );
}

export default CardSwiperActionButton;
