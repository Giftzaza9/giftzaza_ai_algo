import React, { useEffect, useState } from 'react';
import Router from './routes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@mui/material';
import { theme } from './utils/theme';
import { BottomNav } from './components/shared/BottomNav';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { isMobileBrowser } from './utils/helperFunctions';
import { PwaDialogue } from './components/shared/PwaDialog';


const App: React.FC = () => {
  const [pwaPromptOpen, setPwaPromptOpen] = useState(false);
  useEffect(() => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any)?.standalone;
    if (isMobileBrowser() && !isInstalled) {
      setPwaPromptOpen(true);
    }
  }, []);

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
        <PwaDialogue
          open={pwaPromptOpen}
          onClose={() => {
            setPwaPromptOpen(false);
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
