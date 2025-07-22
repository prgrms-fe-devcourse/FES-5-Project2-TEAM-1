import RightSidebar from './components/Layout/RightSidebar'
import './App.css'
import './style/reset.css'
import LeftSidebar from './components/Layout/LeftSidebar';
import MainContent from './pages/Mainpage/MainContent';
import Footer from './pages/Mainpage/footer';

function App() {
  return (
    <div className='container'>
      <LeftSidebar />
      <div className="mainWrapper">
        <MainContent />
        <Footer />
      </div>
      <RightSidebar />
    </div>
  );
}
export default App
