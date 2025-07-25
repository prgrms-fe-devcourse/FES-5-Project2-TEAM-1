import RightSidebar from './components/Layout/RightSidebar'
import './App.css'
import './style/reset.css'
import LeftSidebar from './components/Layout/LeftSidebar';

import { Route, Routes } from 'react-router-dom';
import StudyChannel from './pages/Study/StudyChannel';
import StudyJoinInfomation from './pages/Study/StudyJoinInfomation';
import StudyMemberChannel from './pages/Study/StudyMemberChannel';
import Thread from './pages/Study/components/Thread';
import Mypage from './pages/Mypage/Mypage';


function App() {
  return (
    <div className="container">
      <nav className="leftcontainer">
        <LeftSidebar />
      </nav>
      {/* 컴포넌트 들어오면 됩니다 */}

      <Mypage />
      <nav className="rightcontainer">

        <RightSidebar />
      </nav>
    </div>
  );
}
export default App
