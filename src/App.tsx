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

import MainContent from "./pages/Mainpage/MainContent";
import Footer from "./pages/Mainpage/Footer";
import Register from "./pages/Register";
import Login from "./pages/Login/login";
import Management from "./pages/Study/components/management/Management";
import Approve from "./pages/Study/components/management/Approve";
import ManagementMembers from "./pages/Study/components/management/ManagementMembers";
import MangementChannel from "./pages/Study/components/management/ManagementChannel";
import BoardWrite from "./pages/BoardForm/BoardWrite";
import { useRef, useState } from "react";
import { AdminProvider } from "./components/context/useAdmin";
import { NotificationProvider } from "./components/context/NotificationContext";
import { useAuth } from "./auth/AuthProvider";
import PeerReiview from "./pages/PeerReview/PeerReiview";
import Team from "./pages/team/Team";

import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin/Admin";




function App() {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";
    const isNotFoundPage = !(
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/register") ||
    path.startsWith("/study") ||
    path.startsWith("/channel") ||
    path.startsWith("/write") ||
      path.startsWith("/mypage/") ||
      path.startsWith('/team')
  );
  const [isOverlay, setIsOverlay] = useState(false)
  const [isNotification, setIsNotification] = useState(false)
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const { profileId } = useAuth();


  const leftSidebarRef = useRef<HTMLElement>(null);
  const leftSidebarButton = useRef<HTMLButtonElement>(null);
  const rightSidebarRef = useRef<HTMLElement>(null);
  const rightSidebarButton = useRef<HTMLButtonElement>(null);

  const toggleLeftSidebar = () => {
    if (!leftSidebarRef.current || !leftSidebarButton.current) return;
    leftSidebarRef.current.classList.toggle("active");
    leftSidebarButton.current.classList.toggle('isOpen');
    setIsLeftSidebarOpen(prev => !prev);
  }

  const toggleRightSidebar = () => {
    if (!rightSidebarRef.current || !rightSidebarButton.current) return;
    rightSidebarRef.current.classList.toggle("active");
    rightSidebarButton.current.classList.toggle('isOpen');
    setIsRightSidebarOpen(prev => !prev);
  }
  
  return (
    <NotificationProvider profileId={profileId}>
      <div className="container">
        {isOverlay && (
          <div
            className="overlay"
            onClick={() => {
              setIsNotification(!isNotification);
              setIsOverlay(!isOverlay);
            }}
          ></div>
        )}
        {!isAuthPage && !isNotFoundPage && (
          <>
            <button id="leftSidebar" onClick={toggleLeftSidebar} ref={leftSidebarButton}>
              <img 
                src={isLeftSidebarOpen ? '/images/close.png' : '/images/leftSidebar.png'} 
                title={isLeftSidebarOpen ? '닫기' : '좌측 사이드바 열기'}
                alt="left Sidebar Toggle"
              />
            </button>
            <nav className="leftcontainer" ref={leftSidebarRef}>
              {isOverlay && (
                <div
                  className="overlay"
                  onClick={() => setIsOverlay(false)}
                ></div>
              )}
              <LeftSidebar />
            </nav>
          </>
        )}
        <div className={`mainWrapper ${(isAuthPage || isNotFoundPage) ? "fullWidth" : ""}`} id='standard-container'>
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/study" element={<StudyChannel />} />
            <Route path='/team' element={<Team/>}/>
            <Route
              path="/channel/:id"
              element={
                  <AdminProvider>
                    <StudyMemberChannel />
                  </AdminProvider>
              }
            >
              <Route index element={<StudyJoinInfomation />} />
              <Route path="memberchannel" element={<StudyMemberChannel />} />
              <Route path="thread" element={<Thread />} />
              <Route path='peerReview/:id' element={<PeerReiview/>}/>
              <Route path="management" element={<Management />}>
                <Route index element={<MangementChannel />} />
                <Route path="approve" element={<Approve />} />
                <Route
                  path="managementmembers"
                  element={<ManagementMembers />}
                />
              </Route>
            </Route>
            <Route path="/write" element={<BoardWrite />} />
            <Route path="/write/:id" element={<BoardWrite />} />
            <Route path="/mypage/:id" element={<Mypage />} />
            {
              profileId === 'a51ad237-ffd7-44c9-b00d-1f6f007f0999' && (
                <Route path="/admin" element={<Admin/>}></Route>
              )
            }

            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {!isAuthPage && !isNotFoundPage && <Footer />}
        </div>

        {!isAuthPage && !isNotFoundPage && (
          <>
            <button id="rightSidebar" onClick={toggleRightSidebar} ref={rightSidebarButton}>
              <img 
                src={isRightSidebarOpen ? '/images/close.png' : '/images/rightSidebar.png'} 
                title={isRightSidebarOpen ? '닫기' : '우측 사이드바 열기'}
                alt="right Sidebar Toggle"
              />
            </button>
            <nav className="rightcontainer" ref={rightSidebarRef}>
              <RightSidebar
                isOverlay={isOverlay}
                setIsOverlay={setIsOverlay}
                isNotification={isNotification}
                setIsNotification={setIsNotification}
              />
            </nav>
          </>
        )}
        </div>
    </NotificationProvider>
  );
}
export default App;
