
import RightSidebar from './components/Layout/RightSidebar'
import './App.css'
import './style/reset.css'
import LeftSidebar from './components/Layout/LeftSidebar';
import StudyJoinInfomation from './pages/Study/studyJoinInfomation';
// import StudyChannel from './pages/Study/StudyChannel';



function App() {
  
  return (
    <div className="container">
      <LeftSidebar />
      {/* 컴포넌트 들어오면 됩니다 */}
      <StudyJoinInfomation/>
      <RightSidebar />
    </div>
  );
}

export default App
