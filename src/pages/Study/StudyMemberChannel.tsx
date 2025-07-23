// import StudyMemberChannelContent from './components/StudyMemberChannelContent';
import S from './StudyMemberChannel.module.css'
import Thread from './components/Thread';

function StudyMemberChannel() {
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
      {/* <StudyMemberChannelContent /> */}
      <Thread/>
    </main>
  );
}
export default StudyMemberChannel