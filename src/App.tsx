import RightSidebar from './components/Layout/RightSidebar'
import './App.css'
import LeftSidebar from './components/Layout/LeftSidebar';
import Mypage from './pages/Mypage/Mypage';
function App() {
  return (
    <div className='container'>
      <LeftSidebar />
      < Mypage/>
      <RightSidebar />
    </div>
  );
}
export default App
