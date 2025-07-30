import { useBoardContext } from "@/components/context/useBoardContext";
import S from "./BoardButtonArea.module.css";
const BUTTON_LIST = [
  { tag: "h1", text: "\n# " },
  { tag: "h2", text: "\n## " },
  { tag: "h3", text: "\n### " },
  { tag: "bold", text: "\n**TEXT**" },
  { tag: "italic", text: "\n*TEXT*" },
  { tag: "cancelline", text: "\n~~TEXT~~" },
  { tag: "Quote", text: "\n> " },
  { tag: "Picture", text: "" },
  { tag: "Link", text: "\n[TEXT](Link)" },
  { tag: "Code", text: "\n```\nText\n```" },
];
interface MarkdownOption {
  tag: string;
  text: string;
}
function BoardButtonArea() {
  const { setPostData } = useBoardContext();

  const handleMarkdownMenu = (icons: MarkdownOption) => {
    setPostData((prev) => {
      return { ...prev, contents: prev.contents + icons.text };
    });
  };

  const handleChange = (file: File) => {
    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   setPostData((prev) => {
    //     return {
    //       ...prev,
    //       contents: prev.contents + `\n![TEXT](${file.nma})`,
    //     };
    //   });
    // };
    // reader.readAsDataURL(file);
    const blobUrl = URL.createObjectURL(file);
    setPostData((prev) => {
      return {
        ...prev,
        contents: prev.contents + `\n![${file.name}](${blobUrl})`,
      };
    });
  };
  return (
    <div className={S.optionButton}>
      <ul>
        {BUTTON_LIST.map((icons) => {
          const src = `/icons/${icons.tag}.svg`;
          return (
            <li key={icons.tag}>
              {icons.tag !== "Picture" ? (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleMarkdownMenu(icons);
                  }}
                >
                  <img src={src} alt="마크다운 삽입버튼" />
                </a>
              ) : (
                <label htmlFor="markdownPicture">
                  <input
                    type="file"
                    id="markdownPicture"
                    hidden
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (!target.files) return;
                      const file = target.files[0];
                      handleChange(file);
                    }}
                  />
                  <img src={src} alt="마크다운 삽입버튼" />
                </label>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export default BoardButtonArea;
