
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@/style/main.css'
import App from './App.tsx'
import ToastProvider from './components/ToastProvider.tsx';
import { AuthProvider } from './auth/AuthProvider.tsx'
import { KakaoLoaderProvider } from './components/context/useKakaoLoaderProvider.tsx'


createRoot(document.getElementById("root")!).render(
 
    <ToastProvider>
      <BrowserRouter>
        <AuthProvider>
          <KakaoLoaderProvider> 
              <App />
          </KakaoLoaderProvider>
        </AuthProvider>
      </BrowserRouter>
    </ToastProvider>

);

