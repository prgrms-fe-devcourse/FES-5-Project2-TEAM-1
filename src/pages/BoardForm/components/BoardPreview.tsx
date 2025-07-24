import S from "../BoardForm.module.css";
import mark from "./markdown.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  markdown: string;
}
function BoardPreview({ markdown }: Props) {
  return (
    <div className={`${S.boardPreview} ${mark.markdown}`}>
      {markdown === "" ? (
        <p className={S.boardPreviewDefaultText}>Preview</p>
      ) : (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      )}
    </div>
  );
}
export default BoardPreview;
