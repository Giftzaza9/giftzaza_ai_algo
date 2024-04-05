import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import React, { FC } from 'react';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const PwaDialogue: FC<Props> = ({ onClose, open }) => {
  const handleInstallClick = () => {
    if ('serviceWorker' in navigator) {
      const button = document.querySelector('#invisible-button')
      if(button) (button as any)?.click()
      else toast.error("Installation failed")
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
        <Button id="install-button" onClick={handleInstallClick} >
          Install
        </Button>
      </DialogActions>
    </Dialog>
  );
};
