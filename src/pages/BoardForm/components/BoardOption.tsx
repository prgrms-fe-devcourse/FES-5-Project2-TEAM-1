import DragDropFile from "@/components/DragDropFile";
import S from "./BoardOption.module.css";
import HashTag from "@/components/HashTag";
import { useProfileImageContext } from "@/components/context/useProfileImage";
import { useId } from "react";
import { useBoardContext } from "@/components/context/useBoardContext";

function BoardOption() {
  const { setProfileImage } = useProfileImageContext();
  const { setPostData } = useBoardContext();
  const titleId = useId();

  const handleFileSelect = (file: File) => {
    setProfileImage(file);
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
            placeholder="제목을 입력해주세요"
          />
        </div>
        <HashTag />
        <div className={S.optionButton}>
          <ul>
            <li>
              <a href="">
                <img src="/icons/Picture.png" alt="" />
              </a>
            </li>
            <li>
              <a href="">
                <img src="/icons/Link.png" alt="" />
              </a>
            </li>
            <li>
              <a href="">
                <img src="/icons/Code.png" alt="" />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default BoardOption;
