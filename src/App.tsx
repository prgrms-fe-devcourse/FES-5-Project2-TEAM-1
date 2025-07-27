import RightSidebar from './components/Layout/RightSidebar'
import './App.css'
import './style/reset.css'
import LeftSidebar from './components/Layout/LeftSidebar';
import { Route, Routes } from 'react-router-dom';
import StudyChannel from './pages/Study/StudyChannel';
import StudyMemberChannel from './pages/Study/StudyMemberChannel';
import Thread from './pages/Study/components/Thread';
import MainContent from './pages/Mainpage/MainContent';
import Mypage from './pages/Mypage/Mypage';
import StudyJoinInfomation from './pages/Study/StudyJoinInfomation';
import ToastProvider from './components/ToastProvider';


function App() {
  return (
    <ToastProvider>
      <div className="container">
        <nav className="leftcontainer">
          <LeftSidebar />
        </nav>
        {/* 컴포넌트 들어오면 됩니다 */}
        <main className="components">
          <Routes>
            <Route path="/study" element={<StudyChannel />} />
            <Route path="/study/:id" element={<StudyJoinInfomation />} />
            <Route path='/channel/:id' element={<StudyMemberChannel />} />
            <Route path='/channel/memeber/:id' element={<StudyMemberChannel />} />
            <Route path='/channel/thread/:id' element={<Thread/>}/>
            <Route path="/mypage" element={<Mypage />} />
          </Routes>
        </main>
        <nav className="rightcontainer">

          <RightSidebar />
        </nav>
      </div>
    </ToastProvider>
  );
}
export default App
