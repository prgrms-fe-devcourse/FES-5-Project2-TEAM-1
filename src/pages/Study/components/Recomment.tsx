import S from './Recomment.module.css'

function Recomment() {
  return (
    <div className={S.container}>
      <div className={S.writerBox}>
        <div className={S.profile}>
          <img src="/images/너굴.png" alt="" />
          <p>이름</p>
        </div>
  
      <input type="text" placeholder="답글을 달아주세요" />
      <button type="submit" className={S.commentBtn}>
        답글
        </button>
      </div>
      <ul>
        <li className={S.recomments}>
          <div className={S.writerBox}>
            <div className={S.profile}>
              <img src="/images/너굴.png" alt="" />
              <p>이름</p>
             </div>
          </div>
          <p>녹아내려요</p>
        </li>
      </ul>
    </div>
  );
}
export default Recomment