import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
BrowserRouter
import '@/style/main.css'
// import Login from './pages/Login/Login';
// import Register from './pages/Register';
import App from './App.tsx'






createRoot(document.getElementById("root")!).render(
  <StrictMode> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* <Login /> */}
      {/* <Register /> */}
  </StrictMode>
);

