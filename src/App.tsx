import RightSidebar from './components/Layout/RightSidebar'
import './App.css'
import './style/reset.css'
import LeftSidebar from './components/Layout/LeftSidebar';
import { Route, Routes } from 'react-router-dom';
import StudyChannel from './pages/Study/StudyChannel';
import StudyMemberChannel from './pages/Study/StudyMemberChannel';
import Thread from './pages/Study/components/Thread';

import Mypage from './pages/Mypage/Mypage';
import StudyJoinInfomation from './pages/Study/StudyJoinInfomation';
import ToastProvider from './components/ToastProvider';
import MainContent from './pages/Mainpage/MainContent';


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
            <Route path="/" element={<MainContent />} />
            <Route path="/study" element={<StudyChannel />} />

            <Route path="/channel/:id" element={<StudyMemberChannel />}>
              <Route index  element={<StudyJoinInfomation />} />
              <Route
                path="memberchannel"
                element={<StudyMemberChannel />}
              />
              <Route path="thread" element={<Thread />} />
            </Route>


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
