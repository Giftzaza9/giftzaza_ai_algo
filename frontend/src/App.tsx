import React from 'react';
import Router from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@mui/material';
import { theme } from './utils/theme';
import { BottomNav } from './components/shared/BottomNav';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
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
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
