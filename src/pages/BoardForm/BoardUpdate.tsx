import S from "./BoardForm.module.css";
import BoardPreview from "./components/BoardPreview";
import BoardEdit from "./components/BoardEdit";
import { useEffect } from "react";

import supabase from "@/supabase/supabase";
import { useBoardContext } from "@/components/context/useBoardContext";

import { useToast } from "@/utils/useToast";
import { useHashTagContext } from "@/components/context/useHashTag";

import { useProfileImageContext } from "@/components/context/useProfileImage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface boardData {
  profile_id: string;
  title: string;
  contents: string;
}

interface Props {
  boardId?: string;
  userId: string;
}
function BoardUpdate({ boardId, userId }: Props) {
  const { postData, setPostData } = useBoardContext();
  const { hashTagData, sethashTagData } = useHashTagContext();
  const { profileImage, setImageUrl } = useProfileImageContext();
  const { error: errorPop } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (boardId) {
      const selectBoardData = async () => {
        const { data: boardData, error: boardError } = await supabase
          .from("board")
          .select("*")
          .eq("board_id", boardId)
          .single();
        if (boardError) {
          throw new Error("Board 데이터를 불러오는데 실패하였습니다.");
        }

        if (boardData) {
          setPostData((prev) => {
            return {
              ...prev,
              title: boardData.title,
              contents: boardData.contents,
            };
          });
          setImageUrl(boardData.images);
        }
        const { data: boardTag, error: boardTagError } = await supabase
          .from("board_tag")
          .select("*")
          .eq("board_id", boardId);

        if (boardTagError) {
          throw new Error("해시 태그를 불러오는 중 오류가 발생했습니다.");
        }
        const tag = boardTag.map((tags) => {
          return { value: tags.hash_tag };
        });
        sethashTagData([...tag]);
      };
      selectBoardData();
    }
  }, []);

  const updateBoard = async (insertData: boardData) => {
    const { data, error } = await supabase
      .from("board")
      .update(insertData)
      .eq("board_id", boardId)
      .select();
    if (error) {
      throw new Error("글게시에 실패하였습니다.");
    }

    if (data) {
      updateHashTag(data[0].board_id);
      imageUpload(data[0].board_id);
      toast.success("글이 수정되었습니다.", {
        onClose() {
          navigate(`/channel/${boardId}`);
        },
        autoClose: 1500,
      });
    }
  };

  const updateHashTag = async (board_id: string) => {
    if (!hashTagData) return;
    const { error: deleteError } = await supabase
      .from("board_tag")
      .delete()
      .eq("board_id", board_id);
    if (deleteError) {
      throw new Error("hashTag 데이터 삭제 중 오류발생");
    }
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

    if (!postData || postData?.title === "") {
      errorPop("제목을 작성해주세요!");
      return;
    }
    if (!postData || postData?.contents === "") {
      errorPop("글을 작성해주세요");
      return;
    }

    const insertData = {
      profile_id: userId,
      title: postData.title,
      contents: postData.contents,
    };

    updateBoard(insertData);
  };
  const imageUpload = async (board_id: string) => {
    let imageUrl = "";
    if (!profileImage) return;
    const fileExt = profileImage.name.split(".").pop(); // 확장자 추출
    const fileName = `${board_id}.${fileExt}`; // 중복 방지를 위한 이름

    const { error } = await supabase.storage
      .from("boardimage")
      .upload(fileName, profileImage);

    if (error) {
      errorPop("이미지 업로드에 실패하였습니다.");

      throw new Error(error.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("boardimage")
      .getPublicUrl(fileName);

    imageUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from("board")
      .update({ images: imageUrl })
      .eq("board_id", board_id);
    if (updateError) {
      throw new Error("이미지 update 중 오류가 발생하였습니다.");
    }
  };

  return (
    <div>
      <div className={S.bContainer}>
        <BoardEdit />
        <BoardPreview />
      </div>
      <div className={S.boardBottonArea}>
        <button id={S.boardWrite} type="button" onClick={handleBoardUpload}>
          글 수정
        </button>
      </div>
    </div>
  );
}
export default BoardUpdate;
