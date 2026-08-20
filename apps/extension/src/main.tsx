import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './Apps/PopUp/App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
