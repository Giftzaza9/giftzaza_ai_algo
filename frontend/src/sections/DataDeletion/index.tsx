import React from 'react';
import { Box, Button, Container, Grid } from '@mui/material';
import { theme } from '../../utils/theme';
import { useNavigate } from 'react-router-dom';

export const DataDeletion = () => {

    const navigate = useNavigate();

  return (
    <Grid
      container
      component="main"
      width={'lg'}
      className="full-screen"
      sx={{ backgroundColor: theme.palette.secondary.main, height: '100%' }}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <h3>Disclosure of Your Personal Data</h3>
        <h4>Business Transactions</h4>
        <p>
          If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will
          provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy.
        </p>
        <h4>Law enforcement</h4>
        <p>
          Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law
          or in response to valid requests by public authorities (e.g. a court or a government agency).
        </p>
        <h4>Other legal requirements</h4>
        <p>The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:</p>
        <ul>
          <li>Comply with a legal obligation</li>
          <li>Protect and defend the rights or property of the Company</li>
          <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
          <li>Protect the personal safety of Users of the Service or the public</li>
          <li>Protect against legal liability</li>
        </ul>
        <h3>Security of Your Personal Data</h3>
        <p>
          The security of Your Personal Data is important to Us, but remember that no method of transmission over the
          Internet, or method of electronic storage is 100% secure. While We strive to use commercially acceptable means to
          protect Your Personal Data, We cannot guarantee its absolute security.
        </p>
        <h2>Changes to this Privacy Policy</h2>
        <p>
          We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy
          Policy on this page.
        </p>
        <p>
          We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and
          update the &quot;Last updated&quot; date at the top of this Privacy Policy.
        </p>
        <p>
          You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are
          effective when they are posted on this page.
        </p>
        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy or if you want your data to delete, You can contact us by clicking the link below:</p>
        <ul>
          <a href="mailto:giftzaza108@gmail.com?subject=Data Deletion&body=Hi, I want my Facebook data to be deleted !!">giftzaza108@gmail.com</a>
        </ul>
        <Box width={'90%'} mb={2}>
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: '100%' }}
            onClick={() => {
              navigate('/');
            }}
          >
            Back to Login
          </Button>
        </Box>
      </Container>
    </Grid>
  );
};
