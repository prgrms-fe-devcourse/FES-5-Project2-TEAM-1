import RightSidebar from './components/Layout/RightSidebar'
import './App.css'
import './style/reset.css'
import LeftSidebar from './components/Layout/LeftSidebar';

import StudyChannel from './pages/Study/StudyChannel';
import StudyMemberChannel from './pages/Study/StudyMemberChannel';
import Mypage from './pages/Mypage/Mypage';
import MainContent from './pages/Mainpage/MainContent';
import Footer from './pages/Mainpage/Footer';
import { Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register';

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
      {/* <Mypage /> */}
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
