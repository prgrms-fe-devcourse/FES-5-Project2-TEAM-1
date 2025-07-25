import HashTag from "@/components/HashTag";
import S from "../BoardForm.module.css";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onHashTag: (tag: any) => void;
}
function BoardOptionSub({ onHashTag }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const callBack = (tag: any) => {
    onHashTag(tag);
  };
  return (
    <div className={S.boardOptionSub}>
      <HashTag
        // taglist={["JavaScript", "Node.js", "React", "c#"]}
        // defalutList={["JavaScript"]}
        // editable={false}
        callBack={callBack}
      />
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
  );
}
export default BoardOptionSub;
