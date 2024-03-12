import { String } from 'lodash';
import { SwipeAction, SwipeDirection } from '..';

interface ActionButtonProps {
  action: SwipeAction;
  isCustom?: boolean;
  direction: SwipeDirection;
  onClick: (direction: SwipeDirection, action: SwipeAction, currentID: string) => void;
  extraClass?: string;
  children: any;
  currentID: string
}

function CardSwiperActionButton({ direction, isCustom = false, extraClass, action, onClick, children, currentID }: ActionButtonProps) {
  const className = `swipe-card__${isCustom ? 'custom-' : ''}action-button ${extraClass}`;

  return (
    <div className={className} id={`swipe-card__${action}-action-button`} onClick={() => onClick(direction, action, currentID)}>
      {children}
    </div>
  );
}

export default CardSwiperActionButton;
