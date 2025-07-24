
import RightSidebar from './components/Layout/RightSidebar'
import './App.css'
import './style/reset.css'
import LeftSidebar from './components/Layout/LeftSidebar';
import Mypage from './pages/Mypage/Mypage';




function App() {
  
  return (
    <div className="container">
      <nav className='leftcontainer'>
        <LeftSidebar />
      </nav>
      {/* 컴포넌트 들어오면 됩니다 */}
      <Mypage />
      <nav className='rightcontainer'>
        <RightSidebar />
      </nav>
    </div>
  );
}

export default App
