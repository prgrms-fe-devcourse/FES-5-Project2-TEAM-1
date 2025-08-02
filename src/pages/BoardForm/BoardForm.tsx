import S from "./BoardForm.module.css";
import BoardPreview from "./components/BoardPreview";
import BoardEdit from "./components/BoardEdit";
import { useEffect } from "react";
import { format } from "date-fns";

import supabase from "@/supabase/supabase";
import { useBoardContext } from "@/components/context/useBoardContext";

import { useToast } from "@/utils/useToast";
import { useHashTagContext } from "@/components/context/useHashTag";

import { useProfileImageContext } from "@/components/context/useProfileImage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { showConfirmAlert } from "@/utils/sweetAlert";

interface boardData {
  profile_id: string;
  title: string;
  contents: string;
}

interface Props {
  userId: string;
}
function BoardForm({ userId }: Props) {
  const { postData, setPostData } = useBoardContext();
  const { hashTagData } = useHashTagContext();
  const { profileImage } = useProfileImageContext();
  const { success, error: errorPop, info } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId === "") {
      throw new Error("로그인이 필요합니다.");
    }
    const temporarySave = async () => {
      const { data, error } = await supabase
        .from("board_save")
        .select("title, contents, update_at")
        .eq("profile_id", userId);

      const save = data?.[0];
      if (save) {
        if (save.title === "" && save.contents === "") return;
        if (!save.title && !save.contents) return;

        const updateTime = format(save.update_at, "yyyy-MM-dd HH:mm:ss");
        showConfirmAlert(
          updateTime,
          "작성하던 글이 있습니다 불러오시겠습니까?"
        ).then((result) => {
          if (result.isConfirmed) {
            setPostData((prev) => {
              return {
                ...prev,
                title: save.title ?? "",
                contents: save.contents,
              };
            });
          }
        });
      } else {
        const { error } = await supabase
          .from("board_save")
          .insert({ profile_id: userId })
          .select();
        if (error) {
          throw new Error("임시저장 데이터를 만드는 중 에러가 발생했습니다.");
        }
      }
      if (error) {
        throw new Error("임시저장 데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };
    temporarySave();
  }, []);

  const insertBoard = async (insertData: boardData) => {
    const { data, error } = await supabase
      .from("board")
      .insert(insertData)
      .select();
    if (error) {
      throw new Error("글게시에 실패하였습니다.");
    }
    // success("글이 게시되었습니다!");
    if (data) {
      insertHashTag(data[0].board_id);
      imageUpload(data[0].board_id);
      deleteSaveData();
      toast.success("글이 게시되었습니다.", {
        onClose() {
          navigate("/study");
        },
        autoClose: 1500,
      });
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

    insertBoard(insertData);
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

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { error } = await supabase
      .from("board_save")
      .update({
        title: postData?.title ?? "",
        contents: postData?.contents ?? "",
      })
      .eq("profile_id", userId)
      .select();

    if (error) {
      throw new Error("임시저장중 오류가 발생하였습니다.");
    }
    success("저장되었습니다");
    info("이미지와 해시태그는 저장되지 않습니다");
  };

  const deleteSaveData = async () => {
    const { error } = await supabase
      .from("board_save")
      .delete()
      .eq("profile_id", userId);
    if (error) {
      throw new Error("임시 저장 데이터 삭제를 실패했습니다.");
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
          글 게시
        </button>
        <button type="button" onClick={handleSave}>
          임시 저장
        </button>
      </div>
    </div>
  );
}
export default BoardForm;
