interface CardSwiperRibbonsProps {
  ribbonColors?: {
    bgLike?: string;
    bgDislike?: string;
    textColor?: string;
  };
  likeRibbonText?: string;
  dislikeRibbonText?: string;
}

function CardSwiperRibbons({ ribbonColors, dislikeRibbonText, likeRibbonText }: CardSwiperRibbonsProps) {
  return (
    <div className="swipe-card__ribbons-container" id="swipe-card__ribbons-container">
      <div
        id="swipe-card__ribbon-like"
        className="swipe-card__ribbon-like"
        style={{ color: ribbonColors?.bgLike, backgroundColor: 'white', border: '4px solid' }}
      >
        {likeRibbonText || 'LIKE'}
      </div>
      <div
        id="swipe-card__ribbon-dislike"
        className="swipe-card__ribbon-dislike"
        style={{ color: ribbonColors?.bgDislike, backgroundColor: 'white', border: '4px solid' }}
      >
        {dislikeRibbonText || 'PASS'}
      </div>
    </div>
  );
}

export default CardSwiperRibbons;
