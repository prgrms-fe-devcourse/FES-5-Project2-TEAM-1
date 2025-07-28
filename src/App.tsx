
import './App.css'
import './style/reset.css'
import { Route, Routes, useLocation } from 'react-router-dom';

import RightSidebar from './components/Layout/RightSidebar'
import LeftSidebar from './components/Layout/LeftSidebar';
import StudyChannel from './pages/Study/StudyChannel';
import StudyJoinInfomation from './pages/Study/StudyJoinInfomation';
import StudyMemberChannel from './pages/Study/StudyMemberChannel';
import Thread from './pages/Study/components/Thread';
import Mypage from './pages/Mypage/Mypage';
import ToastProvider from './components/ToastProvider';

import MainContent from './pages/Mainpage/MainContent';
import Footer from './pages/Mainpage/Footer';
import Register from './pages/Register';
import Login from "./pages/Login/login";


function App() {

  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
  <ToastProvider>
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
          <Route path="/study" element={<StudyChannel />} />
          <Route path="/study/:id" element={<StudyJoinInfomation />} />
          <Route path='/channel/:id' element={<StudyMemberChannel />} />
          <Route path='/channel/memeber/:id' element={<StudyMemberChannel />} />
          <Route path='/channel/thread/:id' element={<Thread/>}/>
          <Route path="/mypage" element={<Mypage />} />
        </Routes>
        {!isAuthPage && <Footer />}
      </div>
      {!isAuthPage && (
        <nav className='rightcontainer'>
          <RightSidebar />
        </nav>
      )}
    </div>
  </ToastProvider>
  );
}
export default App
