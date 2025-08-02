import MarkDownConvert from "@/components/MarkDownConvert";
import BoardOptionPreview from "./BoardOptionPreview";
import S from "./BoardPreview.module.css";
import { useBoardContext } from "@/components/context/useBoardContext";
import { useEffect, useState } from "react";

function BoardPreview() {
  const [markdown, setMarkDown] = useState("");
  const { postData } = useBoardContext();
  useEffect(() => {
    if (postData) {
      setMarkDown(postData.contents ?? "");
    }
  }, [postData]);
  return (
    <div className={S.boardPreview}>
      <BoardOptionPreview />
      <MarkDownConvert markdown={markdown} addClass={S.boardMarkDown} />
    </div>
  );
}
export default BoardPreview;
