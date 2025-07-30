import { ProfileImageProvider } from "@/components/context/useProfileImage";
import BoardForm from "./BoardForm";
import { BoardProvider } from "@/components/context/useBoardContext";
import { HashTagProvider } from "@/components/context/useHashTag";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import BoardUpdate from "./BoardUpdate";
import { showErrorAlert } from "@/utils/sweetAlert";

function BoardWrite() {
  const { id: boardId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (!user) {
      showErrorAlert("로그인 후 이용해주세요");
      navigate("/login");
      return;
    } else if (user) {
      setUserId(user.profileId);
    }
    // }
  }, [user]);

  return (
    <ProfileImageProvider>
      <BoardProvider>
        <HashTagProvider>
          {userId && boardId && (
            <BoardUpdate boardId={boardId} userId={userId} />
          )}
          {userId && !boardId && <BoardForm userId={userId} />}
        </HashTagProvider>
      </BoardProvider>
    </ProfileImageProvider>
  );
}
export default BoardWrite;
