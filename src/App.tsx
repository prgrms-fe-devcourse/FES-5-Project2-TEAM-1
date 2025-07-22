
import RightSidebar from './components/Layout/RightSidebar'
import './App.css'
import './style/reset.css'
import LeftSidebar from './components/Layout/LeftSidebar';



function App() {
  
  return (
    <div className='container'>
      <LeftSidebar />
      {/* 컴포넌트 들어오면 됩니다 */}
      <RightSidebar />
    </div>
  );
}

export default App
