import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js').then((registration) => {
//       console.log('ServiceWorker registration successful:', registration);
//     }, (error) => {
//       console.log('ServiceWorker registration failed:', error);
//     });
//   });
// }

root.render(
  // <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}>
      <Router basename='/dashboard'>
        <App />
      </Router>
    </GoogleOAuthProvider>
  // </React.StrictMode>
);
