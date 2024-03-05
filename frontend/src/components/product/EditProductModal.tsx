import { FC, useState } from 'react';
import { Product } from '../../constants/types';
import { Box, Button, CircularProgress, Grid, IconButton, Modal, Typography } from '@mui/material';
import { EditProduct } from './EditProduct';
import { Close } from '@mui/icons-material';
import { UpdateProductBody, updateProduct } from '../../services/product';
import { toast } from 'react-toastify';
import { useStyles } from './styles';

interface Props {
  open: boolean;
  onClose: (product?: Product) => void;
  product: Product;
}

export const EditProductModal: FC<Props> = ({ onClose, open, product }) => {
  const classes = useStyles();

  const [updateProductBody, setUpdateProductBody] = useState<UpdateProductBody | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleEditProductChange = (tags: string[], curated: boolean) => {
    setUpdateProductBody({ curated, tags });
  };
  const handleSave = async () => {
    if (!updateProductBody) return;
    try {
      setLoading(true);
      const { data } = await updateProduct(product?.id, updateProductBody);
      setLoading(false);
      if (data) toast.success('Updated the product successfully !');
      onClose(data);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
    >
      <Grid
        className={classes.addProductContainer}
        container
        sx={{
          boxShadow: 24,
          width: { xs: '100vw', md: '45vw' },
          height: { xs: '100vh', md: '85vh' },
        }}
      >
        <Grid item sx={{ position: 'sticky', top: 0, zIndex: 2 }}>
          <Grid sx={{ backgroundColor: '#fff', paddingTop: '24px' }}>
            <Grid item paddingBottom={'8px'}>
              <Typography variant="h6" textTransform={'none'} textAlign={'center'}>
                Edit Product
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

        <EditProduct product={product!} handleChange={handleEditProductChange} />

        <Grid
          item
          container
          justifyContent={'flex-end'}
          gap={2}
          sx={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#fff' }}
          paddingY={'12px'}
        >
          <Box position={'relative'}>
            <Button
              disabled={loading || !updateProductBody}
              variant="contained"
              color="primary"
              size="small"
              sx={{ padding: '12px 20px' }}
              onClick={() => {
                handleSave();
              }}
            >
              <Typography sx={{ fontWeight: 600, lineHeight: '21px' }}>Save</Typography>
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonCircularProgress} />}
          </Box>
        </Grid>
      </Grid>
    </Modal>
  );
};
