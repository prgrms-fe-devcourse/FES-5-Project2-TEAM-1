import S from "./MarkDownConvert.module.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  markdown: string;
  addClass?: string;
}

function MarkDownConvert({ markdown, addClass }: Props) {
  const markDownClass = addClass;
  return (
    <div className={`${markDownClass} ${S.markdown}`}>
      {markdown === "" ? (
        <p className={S.boardPreviewDefaultText}>Preview</p>
      ) : (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdown.replace(/\n/g, "  \n")}
        </ReactMarkdown>
      )}
    </div>
  );
}
export default MarkDownConvert;
