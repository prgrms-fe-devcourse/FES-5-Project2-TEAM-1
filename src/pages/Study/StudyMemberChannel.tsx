import { Link } from 'react-router-dom';
import S from './StudyMemberChannel.module.css'


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
        </div>
      </nav>
    </main>
  );
}
export default StudyMemberChannel