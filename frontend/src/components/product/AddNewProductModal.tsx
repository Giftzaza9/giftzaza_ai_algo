import { Button, Grid, Modal, TextField, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { CustomSteppers } from '../shared/CustomStepper';

const steps = ['Link', 'Product Info', 'Interests'];

interface Props {
  open: boolean;
  onClose: (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void;
}

export const AddNewProductModal: FC<Props> = ({ onClose, open }) => {
  const [link, setLink] = useState<string>('');
  const [activeStep, setActiveStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const handleProceed = () => {
    switch (activeStep) {
      case 0:
        setLoading(true);
        // Scrape the product
        setActiveStep((activeStep) => ++activeStep);
        break;
      case 1:
        setLoading(true);
        // Create the product
        setActiveStep((activeStep) => ++activeStep);
        break;
      case 2:
        setLoading(true);
        // Submit the product
        break;
    }
  };
  const handleBack = () => {
    setActiveStep((prev) => --prev);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, [loading]);

  return (
    <Modal open={open} onClose={onClose}>
      <Grid
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: 24,
          bgcolor: 'white',
          p: '24px',
          borderRadius: '16px',
          width: '45vw',
          height: '85vh',
        }}
        container
        direction={'column'}
      >
        {/* Header */}
        <Grid item pb={3}>
          <Typography variant="h6" textTransform={'none'} textAlign={'center'}>
            Add New Gift
          </Typography>
        </Grid>

        {/* Stepper */}
        <Grid item>
          <CustomSteppers stepperProps={{ activeStep: activeStep }} steps={steps} />
        </Grid>

        {/* Section 1 */}
        {activeStep === 0 && (
          <Grid item >
            <TextField
              fullWidth
              size="small"
              placeholder='Add gift link here'
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
              }}
            />
          </Grid>
        )}

        {activeStep === 1 && 'page2 coming soon'}
        {activeStep === 2 && 'page3 coming soon'}

        {/* Pushes the button down */}
        <Grid item flexGrow={1}></Grid>

        {/* Buttons */}
        <Grid item container justifyContent={'flex-end'} gap={2}>
          {activeStep !== 0 && (
            <Button
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
          <Button
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
        </Grid>
      </Grid>
    </Modal>
  );
};
