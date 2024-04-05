import { FC } from 'react';
import { Product } from '../../constants/types';
import { Grid, IconButton, Modal, Typography } from '@mui/material';
import { PreviewProduct } from './PreviewProduct';
import { Close } from '@mui/icons-material';

interface Props {
  open: boolean;
  product: Product;
  onClose: () => void;
}

export const PreviewModal: FC<Props> = ({ product, onClose, open }) => {
  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
    >
      <Grid
        container
        sx={{
          boxShadow: 24,
          width: { xs: '100vw', md: '45vw' },
          height: { xs: '100vh', md: '85vh' },
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          paddingX: '24px',
          paddingBottom: '24px',
          borderRadius: '16px',
          overflow: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          flexDirection: 'column',
          gap: '24px',
          flexWrap: 'nowrap',
        }}
      >
        <Grid item sx={{ position: 'sticky', top: 0, zIndex: 2 }}>
          <Grid sx={{ backgroundColor: '#fff', paddingTop: '24px' }}>
            <Grid item paddingBottom={'8px'}>
              <Typography variant="h6" textTransform={'none'} textAlign={'center'}>
                Preview
              </Typography>
              <IconButton
                sx={{ position: 'absolute', top: '28px', right: '4px' }}
                onClick={(e) => {
                  onClose();
                }}
              >
                <Close />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <PreviewProduct product={product} />
      </Grid>
    </Modal>
  );
};
