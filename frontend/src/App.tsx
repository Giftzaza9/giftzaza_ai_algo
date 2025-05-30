import React, { useEffect } from 'react';
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
import { observer } from 'mobx-react-lite';
import { pwaPromptOpenState } from './store/PwaPropmtOpen';

const App: React.FC = observer(() => {
  const { pwaPromptOpen, setPwaPromptOpen } = pwaPromptOpenState;

  useEffect(() => {
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any)?.standalone;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any)?.MSStream;
    if (isMobileBrowser() && !isInstalled && !isIOS) {
      setPwaPromptOpen(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          // deferredPrompt={deferredPrompt}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
});

export default App;
