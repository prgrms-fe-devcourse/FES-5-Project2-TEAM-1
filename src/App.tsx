import RightSidebar from './components/Layout/RightSidebar'
import './App.css'
import './style/reset.css'
import LeftSidebar from './components/Layout/LeftSidebar';

import StudyChannel from './pages/Study/StudyChannel';
import StudyMemberChannel from './pages/Study/StudyMemberChannel';
import Mypage from './pages/Mypage/Mypage';
import MainContent from './pages/Mainpage/MainContent';
import Footer from './pages/Mainpage/Footer';

function App() {
  return (
    <div className="container">
      <nav className="leftcontainer">
        <LeftSidebar />
      </nav>
      {/* 컴포넌트 들어오면 됩니다 */}
      {/* <Mypage /> */}
      {/* <div className="mainWrapper">
        <MainContent />
        <Footer />
      </div> */}
      <nav className='rightcontainer'>
        <RightSidebar />
      </nav>
    </div>
  );
}
export default App
