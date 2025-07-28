import { useProfileImageContext } from "@/components/context/useProfileImage";
import S from "./BoardOptionPreview.module.css";
import { useEffect, useState } from "react";
import { useBoardContext } from "@/components/context/useBoardContext";

function BoardOptionPreview() {
  const { profileImage } = useProfileImageContext();
  const [image, setImage] = useState("");
  const { postData } = useBoardContext();
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
        <img src={image ? image : "/images/no_image.png"} alt="" />
      </div>
      <div className={S.previewOption}>
        <div>
          <input
            type="text"
            placeholder="미리보기"
            className={S.titlePreview}
            value={postData?.title}
          />
        </div>
        <div>해시태그</div>
      </div>
    </div>
  );
}
export default BoardOptionPreview;
