import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import BoardProvider from './components/context/BoardProvider.tsx';


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BoardProvider>
      <App />
    </BoardProvider>
  </StrictMode>
);
