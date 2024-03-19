import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import React, { FC } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const PwaDialogue: FC<Props> = ({ onClose, open }) => {
  const handleInstallClick = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('beforeinstallprompt', (event: Event) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        event.preventDefault();
        // Stash the event so it can be triggered later
        const deferredPrompt = event as any;
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
        });
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">{'Install Giftalia App ?'}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Install Giftalia web application, so that it can be easily accessible from your home screen
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
          }}
        >
          Close
        </Button>
        <Button onClick={handleInstallClick}>Install</Button>
      </DialogActions>
    </Dialog>
  );
};
