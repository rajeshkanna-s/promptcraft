import React from 'react';
import ReactDOM from 'react-dom/client';
// BrowserRouter gives clean, indexable URLs (/tools/blog-writer) so each tool
// can rank in search. The host must serve index.html for all routes — see
// public/_redirects (Netlify) for the SPA fallback.
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
