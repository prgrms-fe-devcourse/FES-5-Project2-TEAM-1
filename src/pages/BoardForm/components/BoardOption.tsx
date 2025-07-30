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
  const { setProfileImage, setImageUrl } = useProfileImageContext();
  const { postData, setPostData } = useBoardContext();
  const { hashTagData, sethashTagData } = useHashTagContext();
  const titleId = useId();

  const handleFileSelect = (file: File) => {
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
        {hashTagData && (
          <HashTag
            callBack={handleHashTag}
            defaultList={[...hashTagData.map((tagData) => tagData.value)]}
          />
        )}
        {!hashTagData && <HashTag callBack={handleHashTag} />}
        <BoardButtonArea />
      </div>
    </div>
  );
}
export default BoardOption;
