
import { Link } from "react-router-dom";
import S from "./NotFound.module.css";

function NotFound() {
  return (
    <div className={S.wrapper}>
      <div className={S.container}>
        <div className={S.leftImageWrapper}>
            <img src="/images/notfound.png" alt="캐릭터" className={S.leftImage}/>
        </div>
        <div className={S.rightContent}>
          <img src="/icons/notfound2.svg" alt="경고 아이콘" className={S.icon} />
          <p className={S.message}>404 페이지를 찾을 수 없습니다!</p>
          <Link to="/" className={S.button}>메인으로 이동하기</Link>
        </div>
      </div>
    </div>
  )
}
export default NotFound