import { useLocation } from 'react-router-dom';
import S from './StudyMemberChannel.module.css'
import StudyMemberChannelContent from './components/StudyMemberChannelContent';
// import Thread from './components/Thread';

function StudyMemberChannel() {
  const location = useLocation()
  const card = location.state.card ?? {}
  
  
  return (
    <main className={S.container}>
      <nav className={S.header}>
        <div className={S.headerinner}>
          <a href="" className={S.active}>
            홈
          </a>
          <a href="">스레드</a>
        </div>
      </nav>
      {<StudyMemberChannelContent {...card} />}
      {/* <Thread/> */}
    </main>
  );
}
export default StudyMemberChannel