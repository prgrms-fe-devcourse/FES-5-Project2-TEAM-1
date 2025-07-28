import S from "./BoardForm.module.css";
import BoardPreview from "./components/BoardPreview";
import BoardEdit from "./components/BoardEdit";
import { ProfileImageProvider } from "@/components/context/useProfileImage";
import { BoardProvider } from "@/components/context/useBoardContext";
import { useState } from "react";
import MapSearchPopup from "@/components/MapSearchPopup";

function BoardForm() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ProfileImageProvider>
      <BoardProvider>
        <form>
          <div className={S.bContainer}>
            <BoardEdit />
            <BoardPreview />
          </div>
          <div className={S.boardBottonArea}>
            <button type="button" onClick={() => setIsOpen(true)}>
              임시 저장
            </button>
            <button id={S.boardWrite} type="submit">
              글 게시
            </button>
          </div>
          {isOpen && (
            <MapSearchPopup
              onClose={() => {
                setIsOpen(false);
              }}
            />
          )}
        </form>
      </BoardProvider>
    </ProfileImageProvider>
  );
}
export default BoardForm;
