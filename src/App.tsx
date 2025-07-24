import RightSidebar from './components/Layout/RightSidebar'
import './App.css'
import './style/reset.css'
import LeftSidebar from './components/Layout/LeftSidebar';

import StudyChannel from './pages/Study/StudyChannel';

// import StudyChannel from './pages/Study/StudyChannel';


import MainContent from './pages/Mainpage/MainContent';
import Footer from './pages/Mainpage/footer';

function App() {
  return (
    <div className="container">
      <LeftSidebar />
      {/* 컴포넌트 들어오면 됩니다 */}
      <StudyChannel></StudyChannel>
      <div className="mainWrapper">
        <MainContent />
        <Footer />
      </div>
      <RightSidebar />
    </div>
  );
}
export default App
