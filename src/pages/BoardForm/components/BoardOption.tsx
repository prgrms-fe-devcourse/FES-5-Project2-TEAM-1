import DragDropFile from "@/components/DragDropFile";
import S from "./BoardOption.module.css";
import HashTag from "@/components/HashTag";
import { useProfileImageContext } from "@/components/context/useProfileImage";
import { useId } from "react";
import { useBoardContext } from "@/components/context/useBoardContext";
import { useHashTagContext } from "@/components/context/useHashTag";
import BoardButtonArea from "./BoardButtonArea";

interface BaseTagData {
  value: string;
}

function BoardOption() {
  const { setProfileImage } = useProfileImageContext();
  const { postData, setPostData } = useBoardContext();
  const { sethashTagData } = useHashTagContext();
  const titleId = useId();

  const handleFileSelect = (file: File) => {
    setProfileImage(file);
  };

  const handleHashTag = (values: BaseTagData[]) => {
    sethashTagData(values);
  };

  const onChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const title = target.value;
    setPostData((prev) => {
      return { ...prev, title: title };
    });
  };
  return (
    <div className={S.boardOption}>
      <div>
        <DragDropFile onChangeFile={handleFileSelect} />
      </div>
      <div className={S.boardOptionDetail}>
        <div className={S.boardTitle}>
          <label htmlFor={titleId}></label>
          <input
            type="text"
            id={titleId}
            onChange={onChangeTitle}
            value={postData?.title}
            placeholder="제목을 입력해주세요"
          />
        </div>
        <HashTag callBack={handleHashTag} />
        <BoardButtonArea />
      </div>
    </div>
  );
}
export default BoardOption;
