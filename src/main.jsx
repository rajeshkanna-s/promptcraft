import React from 'react';
import ReactDOM from 'react-dom/client';
// HashRouter keeps deep links working on static hosting (GitHub Pages, etc.)
// without server-side rewrite rules.
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
