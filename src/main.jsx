import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from "./contexts/AuthContext";
import { BetProvider } from './contexts/BetContext';
import { RankingProvider } from './contexts/RankingContext.jsx';
import './index.css';

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
if (import.meta.env.PROD) {
  console.log = () => {};
  console.error = () => {};
  console.warn = () => {};
  console.info = () => {};
}
