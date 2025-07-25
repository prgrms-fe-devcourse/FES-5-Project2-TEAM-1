import { useRef, useState } from "react";
import S from "../BoardForm.module.css";
import { useBoardContext } from "../../../components/context/useBoardContext";
import type { Tables } from "../../../supabase/database.types";
import Calender from "../../../components/Calender";

interface Props {
  getBoardImage: (file: HTMLInputElement) => void;
}

function BoardOptions({ getBoardImage }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isHidden] = useState<boolean>(true);
  const [joinCls, setJoinCls] = useState<"0" | "1">("0");
  const [boardCls, setBoardCls] = useState<"0" | "1">("0");

  const files = useRef<HTMLInputElement | null>(null);
  const { setBoardData } = useBoardContext();

  const handelFileUpload = () => {
    const file = files.current as HTMLInputElement;
    if (!file.files) return;

    getBoardImage(file);
    const fileImageUrl = URL.createObjectURL(file.files[0]);
    setImageUrl(fileImageUrl);
    setBoardData((prev) => {
      const base = prev ?? ({} as Tables<"board">);
      return { ...base, images: fileImageUrl };
    });
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const newTitle = input.value;
    setBoardData((prev) => {
      const base = prev ?? ({} as Tables<"board">);
      return { ...base, title: newTitle };
    });
  };
  const handleMember = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const member = input.value;
    setBoardData((prev) => {
      const base = prev ?? ({} as Tables<"board">);
      return { ...base, member: member };
    });
  };

  const handleRadioJoin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const radio = e.target as HTMLInputElement;
    const value = radio.value;
    if (value !== "0" && value !== "1") return;

    setJoinCls(value);
    setBoardData((prev) => {
      const base = prev ?? ({} as Tables<"board">);
      return { ...base, join_cls: value };
    });
  };

  const handleRadioBoard = (e: React.ChangeEvent<HTMLInputElement>) => {
    const radio = e.target as HTMLInputElement;
    const value = radio.value;
    if (value !== "0" && value !== "1") return;
    setBoardCls(value);
    setBoardData((prev) => {
      const base = prev ?? ({} as Tables<"board">);
      return { ...base, board_cls: value };
    });
  };

  const getDate = (date: string) => {
    console.log("date", date);
    if (!date) return;
    setBoardData((prev) => {
      const base = prev ?? ({} as Tables<"board">);
      return { ...base, due_date: date };
    });
  };

  return (
    <div className={S.boardOption}>
      <div className={S.boardOptionDetail}>
        <div className={S.boardTitle}>
          <label htmlFor="" hidden>
            제목
          </label>
          <input
            type="text"
            required
            placeholder="제목을 입력해주세요"
            onChange={handleChangeTitle}
          />
        </div>
        <div className={S.boardSecondOption}>
          <div className={S.calendar}>
            <label htmlFor="">모집 마감일</label>
            <Calender isHidden={isHidden} callBack={getDate} />
          </div>
          <div>
            <label htmlFor="">모집 인원</label>
            <input type="text" onChange={handleMember} maxLength={3} />
          </div>
        </div>
        <div className={S.boardThird}>
          <div>
            <p>게시글 분류</p>
            <label htmlFor="study">
              <input
                type="radio"
                id="study"
                value="0"
                name="board_cls"
                checked={boardCls === "0"}
                onChange={handleRadioBoard}
              />
              스터디
            </label>
            <label htmlFor="project">
              <input
                type="radio"
                id="project"
                name="board_cls"
                value="1"
                checked={boardCls === "1"}
                onChange={handleRadioBoard}
              />
              프로젝트
            </label>
          </div>
          <div>
            <p>모집 분류</p>
            <label htmlFor="free">
              <input
                type="radio"
                id="free"
                name="join_cls"
                value="0"
                checked={joinCls === "0"}
                onChange={handleRadioJoin}
              />
              자유가입
            </label>
            <label htmlFor="permission">
              <input
                type="radio"
                id="permission"
                name="join_cls"
                value="1"
                checked={joinCls === "1"}
                onChange={handleRadioJoin}
              />
              승인가입
            </label>
          </div>
        </div>
      </div>
      <div className={S.boardOptionImage}>
        <img src={imageUrl ? imageUrl : ""} alt="" />
        <label htmlFor="file-upload">사진 첨부</label>
        <input
          type="file"
          accept="image/*"
          id="file-upload"
          ref={files}
          onChange={handelFileUpload}
        />
      </div>
    </div>
  );
}
export default BoardOptions;
