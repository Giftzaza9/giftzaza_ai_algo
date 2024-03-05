import { Box, Fade, useScrollTrigger } from '@mui/material';
import React, { FC } from 'react';

interface Props {
  window?: () => Window;
  children: React.ReactElement;
}
export const ScrollToTop: FC<Props> = (props) => {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = ((event.target as HTMLDivElement).ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: { xs: '84px', md: '16px' }, right: { xs: '16px', md: '16px' } }}
      >
        {children}
      </Box>
    </Fade>
  );
};
