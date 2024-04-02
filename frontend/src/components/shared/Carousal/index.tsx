import * as React from 'react';
import Carousel from 'react-material-ui-carousel';

interface Props {
    images: string[];
}

export const Carousal: React.FC<Props> = ({ images }) => {
  return (
    <Carousel
      animation="fade"
      indicators
      indicatorContainerProps={{ style: { marginTop: 0 } }}
      duration={500}
      navButtonsAlwaysInvisible={false}
      navButtonsAlwaysVisible={false}
      cycleNavigation
      fullHeightHover
      swipe
      height={'260px'}
    >
      {images?.map((el, index) => (
        <img src={el} alt={`img-${index}`} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
      ))}
    </Carousel>
  );
};
