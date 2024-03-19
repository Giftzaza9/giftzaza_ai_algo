import { Button } from '@mui/material';
import { MobileLayout } from '../../components/shared/MobileLayout'

export const Saved = () => {

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
    }
  };

  return (
    <MobileLayout>
        Saved

        <Button variant='contained' color='secondary' onClick={handleInstallClick}>Download App</Button>
    </MobileLayout>
  )
}
