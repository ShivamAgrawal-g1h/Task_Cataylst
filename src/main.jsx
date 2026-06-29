import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#1F2937',
          color: '#F1F5F9',
          border: '1px solid #374151',
          borderRadius: '12px',
        },
      }}
    />
  </StrictMode>
);
