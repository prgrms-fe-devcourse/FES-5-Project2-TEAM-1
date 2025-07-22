import RightSidebar from './components/Layout/RightSidebar'
import './App.css'
import LeftSidebar from './components/Layout/LeftSidebar';
import MypageTop from './pages/Mypage/MypageTop';
function App() {
  return (
    <div className='container'>
      <LeftSidebar />
      < MypageTop/>
      <RightSidebar />
    </div>
  );
}
export default App
