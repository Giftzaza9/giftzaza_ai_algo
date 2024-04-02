import React from 'react';
import Router from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@mui/material';
import { theme } from './utils/theme';
import { BottomNav } from './components/shared/BottomNav';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Router />
        <ToastContainer
          progressStyle={{ color: '#4318FF' }}
          bodyStyle={{ color: '#00000', fontWeight: '400' }}
          theme="colored"
          hideProgressBar
        />
        <BottomNav />
      </div>
    </ThemeProvider>
  );
};

export default App;
