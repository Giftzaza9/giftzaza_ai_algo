import { SwipeAction, SwipeDirection } from '..'
import CloseIcon from '@mui/icons-material/Close';

interface ActionButtonProps {
  action: SwipeAction
  isCustom?: boolean
  direction: SwipeDirection
  onClick: (direction: SwipeDirection) => void
  extraClass?: string
  buttonContent: React.ReactNode
  children: any
}

function CardSwiperActionButton({ buttonContent, direction, isCustom = false, extraClass, action, onClick, children }: ActionButtonProps) {
  const className = `swipe-card__${isCustom ? 'custom-' : ''}action-button ${extraClass}`

  return (
    <div className={className} id={`swipe-card__${action}-action-button`} onClick={() => onClick(direction)}>
      {/* <CloseIcon sx={{ fontSize: "50px" }} /> */}
      {children}
    </div>
  )
}

export default CardSwiperActionButton
