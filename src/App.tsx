
import './App.css'
import './style/reset.css'
import { Route, Routes, useLocation } from 'react-router-dom';

import RightSidebar from './components/Layout/RightSidebar'
import LeftSidebar from './components/Layout/LeftSidebar';
import MainContent from './pages/Mainpage/MainContent';
import Footer from './pages/Mainpage/Footer';
import Register from './pages/Register';
import Login from "./pages/Login/login";


function App() {

  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="container">
      {!isAuthPage && (
        <nav className="leftcontainer">
          <LeftSidebar />
        </nav>
      )}
      {/* 컴포넌트 들어오면 됩니다 */}
      <div className="mainWrapper">
        <Routes>
          <Route path="/" element={<MainContent />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        {!isAuthPage && <Footer />}
      </div>
      {!isAuthPage && (
        <nav className='rightcontainer'>
          <RightSidebar />
        </nav>
      )}
    </div>
  );
}
export default App
