import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import TierMotion from './scene/TierMotion';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { VeilProvider } from './context/VeilContext';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TierMotion>
        <AuthProvider>
          <ToastProvider>
            <VeilProvider>
              <App />
            </VeilProvider>
          </ToastProvider>
        </AuthProvider>
      </TierMotion>
    </BrowserRouter>
  </StrictMode>
);
