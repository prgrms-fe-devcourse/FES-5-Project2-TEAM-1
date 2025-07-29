import { useProfileImageContext } from "@/components/context/useProfileImage";
import S from "./BoardOptionPreview.module.css";
import { useEffect, useState } from "react";
import { useBoardContext } from "@/components/context/useBoardContext";

import { useHashTagContext } from "@/components/context/useHashTag";

function BoardOptionPreview() {
  const { profileImage } = useProfileImageContext();
  const [image, setImage] = useState("");
  const { postData } = useBoardContext();
  const { hashTagData } = useHashTagContext();
  console.log("BoardOptionPreview 리렌더됨", hashTagData);
  useEffect(() => {
    if (profileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(profileImage);
    }
  }, [profileImage]);

  return (
    <div className={S.boardOptionPreview}>
      <div className={S.previewImage}>
        {image && <img src={image} alt="프로필이미지" />}
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
