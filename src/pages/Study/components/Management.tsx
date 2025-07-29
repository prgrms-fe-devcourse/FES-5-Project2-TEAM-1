import Approve from './Approve'
import MangementChannel from './ManagementChannel'
import ManagementMembers from './ManagementMembers'
import S from './Management.module.css'

function Management() {
  return (
    <div className={S.container}>
      <aside className={S.managementSidebar}>
        <p>승인요청</p>
        <p>멤버관리</p>
        <p>채널관리</p>
      </aside>
      <main className={S.content}>
        <MangementChannel/> 
        {/* <Approve/>       
        <ManagementMembers/> */}
      </main>
    </div>
  )
}
export default Management