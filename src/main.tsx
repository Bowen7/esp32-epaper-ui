import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@/components/theme-provider';
import App from './App.tsx';
import '@/styles/globals.css';

const THEME_STORAGE_KEY = 'epaper-ui-theme';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
  <ThemeProvider defaultTheme="light" storageKey={THEME_STORAGE_KEY}>
    <App />
    </ThemeProvider >
  </React.StrictMode>
);
