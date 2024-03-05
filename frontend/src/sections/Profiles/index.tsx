import React from 'react';
import { Typography, Container, Grid, Box, Chip } from '@mui/material';
import { MobileLayout } from '../../components/shared/MobileLayout';

export const Profiles = () => {
  return (
    <MobileLayout>
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Grid>
          <Typography>Let’s get started</Typography>
          <Box>
            <Chip
              variant="outlined"
              onClick={(e: any) => {
                console.log(e);
              }}
              label={'Discover gifts for your spouse'}
              sx={{
                padding: '20px 12px',
                borderRadius: '32px',
                //   border: isSelected ? `2px solid rgba(107, 60, 102, 1)` : ' `1px solid rgba(216, 221, 227, 1)`',
                cursor: 'pointer',
              }}
            />
          </Box>
        </Grid>
      </Container>
    </MobileLayout>
  );
};
