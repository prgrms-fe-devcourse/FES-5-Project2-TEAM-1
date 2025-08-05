import Tags from "@yaireo/tagify/react"; // React-wrapper file
import "@yaireo/tagify/dist/tagify.css"; // Tagify CSS
import S from "./HashTag.module.css";
import { useCallback, useRef } from "react";
import type { ChangeEventData } from "@yaireo/tagify";

interface Props {
  taglist?: string[] | null;
  defaultList?: string[] | null;
  editable?: boolean;
  callBack?: (tag: BaseTagData[]) => void;
}
interface BaseTagData {
  value: string;
}

function HashTag({ taglist, defaultList, editable, callBack }: Props) {
  const hasgTag = useRef(null);
  const onChange = useCallback(
    (e: CustomEvent<ChangeEventData<BaseTagData>>) => {
      if (!callBack) return;
      callBack(e.detail.tagify.getCleanValue());
    },
    []
  );

  return (
    <>
      {taglist && editable && (
        <Tags
          ref={hasgTag}
          className={S.hashTag}
          whitelist={taglist}
          userInput={false}
          value={defaultList}
        ></Tags>
      )}
      {taglist && !editable && (
        <Tags
          ref={hasgTag}
          className={S.hashTag}
          whitelist={taglist}
          settings={{ dropdown: { enabled: 0 } }}
          value={defaultList}
          userInput={false}
          readOnly
        ></Tags>
      )}
      {!taglist && (
        <Tags
          ref={hasgTag}
          value={defaultList}
          className={S.hashTagInput}
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
