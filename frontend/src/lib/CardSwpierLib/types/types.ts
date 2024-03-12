export interface SwiperProps extends CardEvents {
  id: CardId
  meta: CardMetaData
  element: HTMLDivElement
  swiperElements: any
}

export interface CardSwiperProps extends CardEvents {
  data: any
  likeButton?: React.JSX.Element
  dislikeButton?: React.JSX.Element
  withActionButtons?: boolean
  emptyState?: React.JSX.Element
  withRibbons?: boolean
  likeRibbonText?: string
  dislikeRibbonText?: string
  ribbonColors?: CardRibbonColors
  actionHandler?: any
}

export interface CardEvents {
  onFinish?: (status: SwipeAction.FINISHED) => void
  onDismiss?: CardEvent
  onEnter?: CardEnterEvent
  swiperElements?: any
}

export interface CardData {
  id: CardId
  src: string
  meta: CardMetaData
  header?: React.JSX.Element
  content?: React.JSX.Element
}

export type CardId = string | number
export type CardEnterEvent = (element: HTMLDivElement, meta: CardMetaData, id: CardId) => void
export type CardEvent = (
  element: HTMLDivElement,
  meta: CardMetaData,
  id: CardId,
  action: SwipeAction,
  operation: SwipeOperation,
) => void
export type CardMetaData = Record<string, unknown> | Array<unknown>
export interface CardRibbonColors {
  bgLike?: string
  bgDislike?: string
  textColor?: string
}
export enum SwipeDirection {
  LEFT = -1,
  RIGHT = 1,
  SIMILAR = 1,
}

export enum SwipeAction {
  LIKE = 'like',
  DISLIKE = 'dislike',
  FINISHED = 'finished',
  BUY = 'buy',
  SIMILAR = 'similar',
}

export enum SwipeOperation {
  SWIPE = 'swipe',
  CLICK = 'click',
}
