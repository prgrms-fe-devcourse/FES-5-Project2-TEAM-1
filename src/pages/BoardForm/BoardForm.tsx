import { useState } from "react";
import S from "./BoardForm.module.css";
import BoardOptions from "./components/BoardOptions";
import BoardOptionSub from "./components/BoardOptionSub";
import BoardPreview from "./components/BoardPreview";
import BoardWriteForm from "./components/BoardWriteForm";
import { debounce } from "../../utils/debounce";
import type { Tables } from "../../supabase/database.types";
import { BoardContext } from "../../components/context/useBoardContext";

function BoardForm() {
  const [markdown, setMarkDown] = useState("");
  const [boardData, setBoardData] = useState<Tables<"board"> | null>(null);
  const handleBoardWrite = debounce(
    (e: React.InputEvent<HTMLTextAreaElement>) => {
      const textarea = e.target as HTMLTextAreaElement;
      setMarkDown(textarea.value);
    },
    700
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBoardData((prev) => {
      const base = prev ?? ({} as Tables<"board">);
      return {
        ...base,
        contents: markdown,
        address: "서울특별시",
        board_id: "board99",
        profile_id: "test99",
      };
    });
    console.log("boardData", boardData);
  };
  return (
    <BoardContext.Provider value={{ boardData, setBoardData }}>
      <form onSubmit={handleSubmit}>
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
    </BoardContext.Provider>
  );
}
export default BoardForm;
