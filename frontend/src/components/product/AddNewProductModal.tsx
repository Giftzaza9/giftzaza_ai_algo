import { Box, Button, CircularProgress, Grid, IconButton, Modal, TextField, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { CustomSteppers } from '../shared/CustomStepper';
import { EditProduct } from './EditProduct';
import { addNewProductSteps } from '../../constants/constants';
import { Product } from '../../constants/types';
import { PreviewProduct } from './PreviewProduct';
import { Close } from '@mui/icons-material';
import { CreateProductBody, createProduct, scrapeProduct } from '../../services/product';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const AddNewProductModal: FC<Props> = ({ onClose, open }) => {
  const [link, setLink] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isValidLink, setIsValidLink] = useState<boolean>(false);
  const [product, setProduct] = useState<Product | undefined>();
  const [createProductBody, setCreateProductBody] = useState<CreateProductBody | undefined>();

  const resetModal = () => {
    setLink('');
    setActiveStep(0);
    setIsValidLink(false);
    setProduct(undefined);
    setCreateProductBody(undefined);
  };

  const handleProceed = async () => {
    try {
      switch (activeStep) {
        case 0:
          setLoading(true);
          const { data: scrapedData } = await scrapeProduct({ product_link: link });
          setProduct(scrapedData);
          setActiveStep((activeStep) => ++activeStep);
          setLoading(false);
          break;
        case 1:
          setLoading(true);
          const { data: createdData } = await createProduct(createProductBody!);
          setProduct(createdData);
          setActiveStep((activeStep) => ++activeStep);
          setLoading(false);
          break;
        case 2:
          toast.success(`Product added successfully !`);
          setLoading(false);
          resetModal();
          onClose();
          break;
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleEditProductChange = (tags: string[], curated: boolean) => {
    setCreateProductBody({ curated: curated, tags: tags, product_id: product?.id as string });
  };

  const handleBack = () => {
    setActiveStep((prev) => --prev);
  };

  useEffect(() => {
    setIsValidLink(link?.startsWith(`https://`) && (link?.includes(`amazon`) || link?.includes(`bloomingdale`)));
  }, [link]);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
    >
      <Grid
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: 24,
          bgcolor: 'white',
          paddingX: '24px',
          borderRadius: '16px',
          width: '45vw',
          height: '85vh',
          overflow: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
        container
        direction={'column'}
        gap={'24px'}
        wrap="nowrap"
      >
        {/* Header + Stepper */}
        <Grid item sx={{ position: 'sticky', top: 0, zIndex: 2 }}>
          <Grid sx={{ backgroundColor: '#fff', paddingTop: '24px' }}>
            <Grid item paddingBottom={'8px'}>
              <Typography variant="h6" textTransform={'none'} textAlign={'center'}>
                Add New Gift
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
            <Grid item paddingBottom={'8px'}>
              <CustomSteppers stepperProps={{ activeStep: activeStep }} steps={addNewProductSteps} />
            </Grid>
          </Grid>
        </Grid>

        {/* Section 1 */}
        {activeStep === 0 && (
          <Grid item paddingY={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add gift link here"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
              }}
            />
          </Grid>
        )}

        {/* Section 2 */}
        {activeStep === 1 && <EditProduct product={product!} handleChange={handleEditProductChange} />}
        {/* Section 3 */}
        {activeStep === 2 && <PreviewProduct product={product!} />}

        {/* Pushes the button down */}
        <Grid item flexGrow={1}></Grid>

        {/* Buttons */}
        <Grid
          item
          container
          justifyContent={'flex-end'}
          gap={2}
          sx={{ position: 'sticky', bottom: 0, zIndex: 1, backgroundColor: '#fff' }}
          paddingY={'12px'}
        >
          {activeStep !== 0 && (
            <Button
              disabled={loading}
              variant="outlined"
              color="secondary"
              size="small"
              sx={{ padding: '12px 20px' }}
              onClick={() => {
                handleBack();
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: '21px' }}>
                Back
              </Typography>
            </Button>
          )}
          <Box position={'relative'}>
            <Button
              disabled={loading || (activeStep === 0 && !isValidLink)}
              variant="contained"
              color="primary"
              size="small"
              sx={{ padding: '12px 20px' }}
              onClick={() => {
                handleProceed();
              }}
            >
              {activeStep !== 2 ? (
                <Typography sx={{ fontWeight: 600, lineHeight: '21px' }}>Next</Typography>
              ) : (
                <Typography>Submit</Typography>
              )}
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  // color: green[500],
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    </Modal>
  );
};
