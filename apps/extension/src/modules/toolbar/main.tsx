import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@lang/i18n';
import './toolbar.css';
import { App } from './App';

createRoot(document.getElementById('toolbar-root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
