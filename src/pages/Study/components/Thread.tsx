import S from './Thread.module.css'
import ThreadList from './ThreadList';

function Thread() {
  return (
    <div className={S.layout}>
      <div className={S.writerBox}>
        <div className={S.profile}>
          <img src="/images/너굴.png" alt="" />
          <p>이름</p>
        </div>
        <div className={S.inputContent}>
          <div className={S.partition}></div>
          <input type="text" placeholder="내용을 입력해 주세요" />
        </div>
        <div className={S.confirmBtnWrap}>
          <button type="submit" className={S.confirm}>
            등록
          </button>
        </div>
      </div>
      <ul className={S.threads}>
        <ThreadList />
        <ThreadList />
        <ThreadList />
      </ul>
    </div>
  );
}
export default Thread