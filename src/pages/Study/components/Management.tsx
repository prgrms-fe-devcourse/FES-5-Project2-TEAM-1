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
      <Outlet/>
    </main>
  )
}
export default Management


// function Management() {
//   return (
//     <div className={S.container}>
//       <aside className={S.managementSidebar}>
//         <p>승인요청</p>
//         <p>멤버관리</p>
//         <p>채널관리</p>
//       </aside>
//       <main className={S.content}>
//         {/* <MangementChannel/>  */}
//         {/* <Approve/>        */}
//         <ManagementMembers/>
//       </main>
//     </div>
//   )
// }
// export default Management