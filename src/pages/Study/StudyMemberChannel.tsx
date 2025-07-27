import { Link } from 'react-router-dom';
import S from './StudyMemberChannel.module.css'
import StudyJoinInfomation from './StudyJoinInfomation';


function StudyMemberChannel() {

  return (
    <main className={S.container}>
      <nav className={S.header}>
        <div className={S.headerinner}>
          <Link to="/channel/member/:id" className={S.active}>
            홈
          </Link>
          <Link to="/channel/thread/:id">
            스레드
          </Link>
          <Link to='/channel/management'>관리</Link>
        </div>
      </nav>
      <StudyJoinInfomation/>
    </main>
  );
}
export default StudyMemberChannel