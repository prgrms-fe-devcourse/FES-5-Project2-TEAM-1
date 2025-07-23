import S from "../BoardForm.module.css";
import BoardHashTag from "./BoardHashTag";

function BoardOptionSub() {
  return (
    <div className={S.boardOptionSub}>
      <BoardHashTag />
      <div className={S.optionButton}>
        <ul>
          <li>
            <a href="">
              <img src="/icons/Picture.png" alt="" />
            </a>
          </li>
          <li>
            <a href="">
              <img src="/icons/Link.png" alt="" />
            </a>
          </li>
          <li>
            <a href="">
              <img src="/icons/Code.png" alt="" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default BoardOptionSub;
