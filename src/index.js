import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="679020371976-1jr3bqhcfhfu1301adhpnovugepjojs3.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);