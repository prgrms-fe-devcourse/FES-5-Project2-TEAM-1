import { useState } from "react";
import S from "./BoardForm.module.css";
import BoardOptions from "./components/BoardOptions";
import BoardOptionSub from "./components/BoardOptionSub";
import BoardPreview from "./components/BoardPreview";
import BoardWriteForm from "./components/BoardWriteForm";
import { debounce } from "@/utils/debounce";
import type { Tables } from "@/supabase/database.types";
import { BoardContext } from "@/components/context/useBoardContext";
import supabase from "@/supabase/supabase";

//board 테이블 type 지정
type boardType = Omit<Tables<"board">, "board_id" | "create_at" | "likes">;
//board_tag 테이블 type 지정
type hashTagType = Omit<Tables<"board_tag">, "tag_id">;

type tagType = {
  value: string;
};
//글쓰기 폼 기본값
const formInit: boardType = {
  profile_id: "",
  title: "",
  contents: "",
  member: "0",
  address: "",
  board_cls: "0",
  join_cls: "0",
  images: "",
  due_date: "",
};

function BoardForm() {
  const [markdown, setMarkDown] = useState("");
  const [boardData, setBoardData] = useState<boardType | null>(formInit);
  const [hashTagData, setHashTagData] = useState<hashTagType[] | null>(null);
  const [boardImage, setBoardImage] = useState<File | null>(null);
  //마크다운 실시간 변환 => debounce적용
  const handleBoardWrite = debounce(
    (e: React.InputEvent<HTMLTextAreaElement>) => {
      const textarea = e.target as HTMLTextAreaElement;
      setMarkDown(textarea.value);
    },
    500
  );

  //hash태그 data-mapping
  const handleHashTag = (tag: tagType[]) => {
    console.log(tag);
    const hashTagArr: hashTagType[] = tag.map((data) => {
      const value: string = data.value;
      const tagObj: hashTagType = {
        board_id: "d1dc2e76-e222-46db-bdc9-ff1c9879bcc0",
        hash_tag: value,
        color_code: "#a6b37d",
      };
      return tagObj;
    });
    if (!hashTagArr) return;
    setHashTagData(hashTagArr);
  };

  //글 게시 submit 이벤트 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!boardData) return;
    const insertBoardData: boardType = {
      ...boardData,
      contents: markdown,
      address: "서울특별시",
      profile_id: "b7009e60-8628-4a42-b9a1-f6bdb264e3a7",
    };

    insertBoard(insertBoardData);
    if (hashTagData) {
      insertHashTag(hashTagData);
    }

    if (boardImage) {
      const fileExt = boardImage.name.split(".").pop();
      const fileName = `b7009e60-8628-4a42-b9a1-f6bdb264e3a7.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from("boardimage")
        .upload(filePath, boardImage, {
          upsert: true,
        });

      if (uploadError) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }
    }
  };
  const getBoardImage = (fileData: HTMLInputElement) => {
    if (!fileData.files) return;
    const file = fileData.files[0] ?? null;
    setBoardImage(file);
  };
  const insertHashTag = async (hashData: hashTagType[]) => {
    const { error } = await supabase.from("board_tag").insert(hashData);
    if (error) {
      throw new Error("글게시에 실패하였습니다.");
    }
  };

  //supabase board테이블 insert
  const insertBoard = async (insertItem: boardType) => {
    console.log(insertItem);
    const { error } = await supabase
      .from("board")
      .insert([insertItem])
      .select();
    if (error) {
      throw new Error("글게시에 실패하였습니다.");
    }
  };
  return (
    <BoardContext.Provider value={{ boardData, setBoardData }}>
      <form onSubmit={handleSubmit}>
        <div className={S.bContainer}>
          <div className={S.boardEdit}>
            <BoardOptions getBoardImage={getBoardImage} />
            <BoardOptionSub onHashTag={handleHashTag} />
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
