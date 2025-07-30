import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@/style/main.css'
// import Login from './pages/Login/Login';
// import Register from './pages/Register';
import App from './App.tsx'
import ToastProvider from './components/ToastProvider.tsx';



import { AuthProvider } from './auth/AuthProvider.tsx'
import { AdminProvider } from './components/context/useAdmin.tsx'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <BrowserRouter>
        <AuthProvider>
          <AdminProvider>
            <App />
          </AdminProvider>
        </AuthProvider>
      </BrowserRouter>
    </ToastProvider>
  </StrictMode>
);

