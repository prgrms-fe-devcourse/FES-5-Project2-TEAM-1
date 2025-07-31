import { useProfileImageContext } from "@/components/context/useProfileImage";
import S from "./BoardOptionPreview.module.css";

import { useBoardContext } from "@/components/context/useBoardContext";

// import { useHashTagContext } from "@/components/context/useHashTag";

function BoardOptionPreview() {
  const { imageUrl } = useProfileImageContext();

  const { postData } = useBoardContext();
  // const { hashTagData } = useHashTagContext();

  return (
    <div className={S.boardOptionPreview}>
      <div className={S.previewImage}>
        {imageUrl !== "" && imageUrl && (
          <img src={imageUrl} alt="프로필이미지" />
        )}
      </div>
      <div className={S.previewOption}>
        <div>
          <input
            type="text"
            className={S.titlePreview}
            value={postData?.title}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
export default BoardOptionPreview;
