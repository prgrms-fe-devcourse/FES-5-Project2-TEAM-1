import S from "./BoardForm.module.css";
import BoardPreview from "./components/BoardPreview";
import BoardEdit from "./components/BoardEdit";
import { ProfileImageProvider } from "@/components/context/useProfileImage";
import { BoardProvider } from "@/components/context/useBoardContext";

function BoardForm() {
  return (
    <ProfileImageProvider>
      <BoardProvider>
        <form>
          <div className={S.bContainer}>
            <BoardEdit />
            <BoardPreview />
          </div>
          <div className={S.boardBottonArea}>
            <button type="button">임시 저장</button>
            <button id={S.boardWrite} type="submit">
              글 게시
            </button>
          </div>
        </form>
      </BoardProvider>
    </ProfileImageProvider>
  );
}
export default BoardForm;
