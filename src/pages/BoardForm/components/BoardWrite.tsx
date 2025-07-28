import { useBoardContext } from "@/components/context/useBoardContext";
import S from "./BoardWrite.module.css";
import { debounce } from "@/utils/debounce";
import type React from "react";
function BoardWrite() {
  const { setPostData } = useBoardContext();

  const onChangeText = debounce((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const content = target.value;
    setPostData((prev) => {
      return { ...prev, contents: content };
    });
  });

  return (
    <div className={S.boardWriteForm}>
      <textarea name="postContent" onChange={onChangeText}></textarea>
    </div>
  );
}
export default BoardWrite;
