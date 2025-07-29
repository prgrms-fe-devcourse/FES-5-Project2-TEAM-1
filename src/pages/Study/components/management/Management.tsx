import { NavLink, Outlet } from 'react-router-dom'
import S from './Management.module.css'

function Management() {
  return (
    <main className={S.container}>
      <nav className={S.managementSidebar}>
        <div className={S.managementSidebarInner}>
          <NavLink
            to='.'
            end
            className={({ isActive }) => (isActive ? S.active : "")}
          >
            채널관리
          </NavLink>
          <NavLink
            to='approve'
            end
            className={({ isActive }) => (isActive ? S.active : "")}
          >
            승인요청
          </NavLink>
          <NavLink
            to='managementmembers'
            end
            className={({ isActive }) => (isActive ? S.active : "")}
          >
            멤버관리
          </NavLink>
        </div>
      </nav>
      <section className={S.content}>
        <h1 hidden>관리 메뉴</h1>
        <Outlet/>
      </section>
    </main>
  )
}
export default Management