import Tags from "@yaireo/tagify/react"; // React-wrapper file
import "@yaireo/tagify/dist/tagify.css"; // Tagify CSS
import S from "./HashTag.module.css";
import { useCallback, useRef } from "react";

interface Props {
  taglist?: string[];
  defaultList?: string[];
  editable?: boolean;
  callBack?: (tag: object[]) => void;
}

function HashTag({ taglist, defaultList, editable, callBack }: Props) {
  const hasgTag = useRef(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChange = useCallback((e: any) => {
    if (!callBack) return;
    callBack(e.detail.tagify.getCleanValue());
  }, []);

  return (
    <>
      {taglist && editable && (
        <Tags
          ref={hasgTag}
          className={S.hashTag}
          whitelist={taglist}
          userInput={false}
          defaultValue={defaultList}
        ></Tags>
      )}
      {taglist && !editable && (
        <Tags
          ref={hasgTag}
          className={S.hashTag}
          whitelist={taglist}
          settings={{ dropdown: { enabled: 0 } }}
          defaultValue={defaultList}
          userInput={false}
          readOnly
        ></Tags>
      )}
      {!taglist && (
        <Tags
          ref={hasgTag}
          className={S.hashTag}
          settings={{ maxTags: 5 }}
          placeholder="해시태그를 입력해주세요"
          onChange={onChange}
          trim
        ></Tags>
      )}
    </>
  );
}

export default HashTag;
