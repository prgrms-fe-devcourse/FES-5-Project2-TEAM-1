import "./App.css";
import "./style/reset.css";

import { Route, Routes, useLocation } from "react-router-dom";
import RightSidebar from "./components/Layout/RightSidebar";
import LeftSidebar from "./components/Layout/LeftSidebar";
import StudyChannel from "./pages/Study/StudyChannel";
import StudyMemberChannel from "./pages/Study/StudyMemberChannel";
import Thread from "./pages/Study/components/Thread";
import Mypage from "./pages/Mypage/Mypage";
import StudyJoinInfomation from "./pages/Study/StudyJoinInfomation";
import ToastProvider from "./components/ToastProvider";
import MainContent from "./pages/Mainpage/MainContent";
import Footer from "./pages/Mainpage/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login/login";
import Management from './pages/Study/components/management/Management';
import Approve from './pages/Study/components/management/Approve';
import ManagementMembers from './pages/Study/components/management/ManagementMembers';
import MangementChannel from './pages/Study/components/management/ManagementChannel';
import BoardWrite from "./pages/BoardForm/BoardWrite";


function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <ToastProvider>
      <div className="container">
        {!isAuthPage && (
          <nav className="leftcontainer">
            <LeftSidebar />
          </nav>
        )}
        <div className="mainWrapper">
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/study" element={<StudyChannel />} />
            <Route path="/channel/:id" element={<StudyMemberChannel />}>
              <Route index element={<StudyJoinInfomation />} />
              <Route path="memberchannel" element={<StudyMemberChannel />} />
              <Route path="thread" element={<Thread />} />
              <Route path="management" element={<Management/>}>
                <Route index element={<MangementChannel/>}/>
                <Route path="approve" element={<Approve/>}/>
                <Route path="managementmembers" element={<ManagementMembers/>}/>
              </Route>
            </Route>
            <Route path="/Write" element={<BoardWrite />} />
            <Route path="/mypage/:id" element={<Mypage />} />
          </Routes>
          {!isAuthPage && <Footer />}
        </div>
        {!isAuthPage && (
          <nav className="rightcontainer">
            <RightSidebar />
          </nav>
        )}
      </div>
    </ToastProvider>
  );
}
export default App;
