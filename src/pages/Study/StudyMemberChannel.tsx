import {  NavLink, Outlet } from 'react-router-dom';
import S from './StudyMemberChannel.module.css'

function StudyMemberChannel() {


  return (
    <main className={S.container}>
      <nav className={S.header}>
        <div className={S.headerinner}>
          <NavLink
            to="."
            end
            className={({ isActive }) => (isActive ? S.active : "")}
          >
            홈
          </NavLink>
          <NavLink
            to="thread"
            className={({ isActive }) => (isActive ? S.active : "")}
          >
            스레드
          </NavLink>
          <NavLink
            to="management"
            className={({ isActive }) => (isActive ? S.active : "")}
          >
            관리
          </NavLink>
        </div>
        <button className={S.joinBtn} type="submit">가입하기</button>
      </nav>

      <Outlet />
    </main>
  );
}
export default StudyMemberChannel