import { ProfileImageProvider } from "@/components/context/useProfileImage";
import BoardForm from "./BoardForm";
import { BoardProvider } from "@/components/context/useBoardContext";
import { HashTagProvider } from "@/components/context/useHashTag";

function BoardWrite() {
  return (
    <ProfileImageProvider>
      <BoardProvider>
        <HashTagProvider>
          <BoardForm />;
        </HashTagProvider>
      </BoardProvider>
    </ProfileImageProvider>
  );
}
export default BoardWrite;
