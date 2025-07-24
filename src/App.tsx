
import RightSidebar from './components/Layout/RightSidebar'
import './App.css'
import './style/reset.css'
import LeftSidebar from './components/Layout/LeftSidebar';
import StudyChannel from './pages/Study/StudyChannel';
import { RouterProvider } from './router';
import { routes } from './router/router';
// import StudyMemberChannel from './pages/Study/StudyMemberChannel';





function App() {
  
  return (
    <div className="container">
      <nav className="leftcontainer">
        <LeftSidebar />
      </nav>
      {/* 컴포넌트 들어오면 됩니다 */}
      <main className="components">
        <RouterProvider navigation={<StudyChannel />} routes={routes} />
      </main>
      <nav className="rightcontainer">
        <RightSidebar />
      </nav>
    </div>
  );
}

export default App
