import { useState } from "react";
import S from "./BoardForm.module.css";
import BoardOptions from "./components/BoardOptions";
import BoardOptionSub from "./components/BoardOptionSub";
import BoardPreview from "./components/BoardPreview";
import BoardWriteForm from "./components/BoardWriteForm";
import { debounce } from "../../utils/debounce";

function BoardForm() {
  const [markdown, setMarkDown] = useState("");

  const handleBoardWrite = debounce(
    (e: React.InputEvent<HTMLTextAreaElement>) => {
      const textarea = e.target as HTMLTextAreaElement;
      setMarkDown(textarea.value);
    },
    700
  );
  return (
    <form action="">
      <div className={S.bContainer}>
        <div className={S.boardEdit}>
          <BoardOptions />
          <BoardOptionSub />
          <BoardWriteForm onInput={handleBoardWrite} />
        </div>
        <BoardPreview markdown={markdown} />
      </div>
      <div className={S.boardBottonArea}>
        <button type="button">
          <img src="/icons/place.png" alt="" /> 장소 찾기
        </button>
        <div>
          <button type="button">임시 저장</button>
          <button id={S.boardWrite} type="submit">
            글 게시
          </button>
        </div>
      </div>
    </form>
  );
}
export default BoardForm;
