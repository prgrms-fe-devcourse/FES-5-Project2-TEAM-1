
import RightSidebar from './components/Layout/RightSidebar'
import './App.css'
import './style/reset.css'
import LeftSidebar from './components/Layout/LeftSidebar';
import StudyMemberChannel from './pages/Study/StudyMemberChannel';

// import StudyChannel from './pages/Study/StudyChannel';

import Mypage from './pages/Mypage/Mypage';
function App() {
  
  return (
    <div className="container">
      <LeftSidebar />
      < Mypage/>
      <StudyMemberChannel/>
      <RightSidebar />
    </div>
  );
}
export default App
