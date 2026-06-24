import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from "./contexts/AuthContext";
import { BetProvider } from './contexts/BetContext';
import { RankingProvider } from './contexts/RankingContext.jsx';
import './index.css';

if (import.meta.env.PROD) {
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <RankingProvider>
        <BetProvider>
          <App />
        </BetProvider>
        </RankingProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
