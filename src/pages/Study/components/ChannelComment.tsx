import S from './ChannelComment.module.css'

function ChannelComment() {
  return (
    <section className={S.container}>
      <div className={S.comment}>
        <div className={S.commetInputBox}>
          <div className={S.writer}>
            <img src="/images/너굴.png" alt="" />
            <p>글쓴이</p>
          </div>
          <input type="text" />
          <button type="submit" className={S.commentBtn}>
            댓글
          </button>
        </div>
      </div>

      <ul className={S.commentListWrap}>
        <li className={S.commentList}>
          <div className={S.writer}>
            <img src="/images/너굴.png" alt="" />
            <div className={S.memberComment}>
              <h6>글쓴이</h6>
              <p>팀장님 퇴근 좀 시켜주세요</p>
            </div>
          </div>
          <div className={S.recommentWrap}>
            <button type="button" className={S.recommentBtn}>
              답글
            </button>
            <li className={S.recomment}>
            <div className={S.writer}>
            <img src="/images/너굴.png" alt="" />
            <div className={S.memberComment}>
              <h6>글쓴이</h6>
              <p>안돼 돌아가</p>
                </div>
                </div>
            </li>
          </div>
        </li>
      </ul>
    </section>
  );
}
export default ChannelComment