import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/style/main.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import ToastProvider from './components/ToastProvider.tsx';




createRoot(document.getElementById("root")!).render(
  <StrictMode>

      <BrowserRouter>
        <App />
      </BrowserRouter>

  </StrictMode>
);

