import S from "./BoardForm.module.css";
import BoardPreview from "./components/BoardPreview";
import BoardEdit from "./components/BoardEdit";
import { useState } from "react";
import MapSearchPopup from "@/components/MapSearchPopup";
import supabase from "@/supabase/supabase";
import { useBoardContext } from "@/components/context/useBoardContext";

import { useToast } from "@/utils/useToast";
import { useHashTagContext } from "@/components/context/useHashTag";

import { useProfileImageContext } from "@/components/context/useProfileImage";

interface boardData {
  profile_id: string;
  title: string;
  contents: string;
}

function BoardForm() {
  const [isOpen, setIsOpen] = useState(false);
  const { postData } = useBoardContext();
  const { hashTagData } = useHashTagContext();
  const { profileImage } = useProfileImageContext();
  const { success, error: errorPop } = useToast();

  const insertBoard = async (insertData: boardData) => {
    const { data, error } = await supabase
      .from("board")
      .insert(insertData)
      .select();
    if (error) {
      throw new Error("글게시에 실패하였습니다.");
    }
    success("글이 게시되었습니다!");
    if (data) {
      insertHashTag(data[0].board_id);
    }
  };

  const insertHashTag = async (board_id: string) => {
    if (!hashTagData) return;

    const hashTag = hashTagData.map((tags) => {
      return {
        board_id: board_id,
        hash_tag: tags.value,
        color_code: "#a6b37d",
      };
    });

    const { error } = await supabase.from("board_tag").insert(hashTag);
    if (error) {
      throw new Error("tag insert 실패.");
    }
  };

  const handleBoardUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    let imageUrl = "";
    if (!postData || postData?.title === "") {
      errorPop("제목을 작성해주세요!");
      return;
    }
    if (!postData || postData?.contents === "") {
      errorPop("글을 작성해주세요");
      return;
    }

    if (!profileImage) return;
    const fileName = `${Date.now()}-${profileImage.name}`; // 중복 방지를 위한 이름
    const filePath = `uploads/${fileName}`; // 원하는 디렉토리 구조

    const { error } = await supabase.storage
      .from("boardimage")
      .upload(filePath, profileImage);

    if (error) {
      errorPop("이미지 업로드에 실패하였습니다.");
      throw new Error(error.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("boardimage")
      .getPublicUrl(filePath);

    imageUrl = publicUrlData.publicUrl;

    const insertData = {
      profile_id: "4071d997-95f6-4630-bae5-5b69ea4d76d7",
      title: postData.title,
      images: imageUrl,
      contents: postData.contents,
    };
    URL.revokeObjectURL(imageUrl);
    insertBoard(insertData);
  };

  return (
    <div>
      <div className={S.bContainer}>
        <BoardEdit />
        <BoardPreview />
      </div>
      <div className={S.boardBottonArea}>
        <button type="button" onClick={() => setIsOpen(true)}>
          임시 저장
        </button>
        <button id={S.boardWrite} type="button" onClick={handleBoardUpload}>
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
    </div>
  );
}
export default BoardForm;
