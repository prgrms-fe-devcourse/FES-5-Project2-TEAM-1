import BoardOption from "./BoardOption";
import BoardWrite from "./BoardWrite";
import S from "./BoardEdit.module.css";

function BoardEdit() {
  return (
    <div className={S.boardEdit}>
      <BoardOption />
      <hr />
      <BoardWrite />
    </div>
  );
}
export default BoardEdit;
