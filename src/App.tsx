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
import { useState } from "react";
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
    path.startsWith("/mypage/")
  );
  const [isOverlay, setIsOverlay] = useState(false)
  const [isNotification, setIsNotification] = useState(false)
  const { profileId } = useAuth();
  
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
          <nav className="leftcontainer">
            {isOverlay && (
              <div
                className="overlay"
                onClick={() => setIsOverlay(false)}
              ></div>
            )}
            <LeftSidebar />
          </nav>
        )}
        <div className={`mainWrapper ${(isAuthPage || isNotFoundPage) ? "fullWidth" : ""}`}>
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
            <Route path="/Write" element={<BoardWrite />} />
            <Route path="/Write/:id" element={<BoardWrite />} />
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
          <nav className="rightcontainer">
            <RightSidebar
              isOverlay={isOverlay}
              setIsOverlay={setIsOverlay}
              isNotification={isNotification}
              setIsNotification={setIsNotification}
            />
          </nav>
        )}
      </div>
    </NotificationProvider>
  );
}
export default App;
