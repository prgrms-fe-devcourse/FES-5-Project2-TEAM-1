import S from "./DragDropFile.module.css";

interface Props {
  onChangeFile: (file: File) => void;
}

function DragDropFile({ onChangeFile }: Props) {
  // 드래그 중인 요소가 목표 지점에 위치할때
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 드래그 중인 요소가 목표 지점에서 드롭될때
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // 드래그되는 데이터 정보와 메서드를 제공하는 dataTransfer 객체 사용
    if (e.dataTransfer) {
      const file = e.dataTransfer.files[0];
      if (!file) return;
      onChangeFile(file);
    }
  };

  // Drag & Drop이 아닌 클릭 이벤트로 업로드되는 기능도 추가
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;
    onChangeFile(file);

    // input 요소의 값 초기화
    e.target.value = "";
  };
  return (
    <div className={S.fileUplaod}>
      <label
        htmlFor="fileUpload"
        // Label에 드래그 앤 드랍 이벤트 추가
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* 프로필로 등록할 이미지를 올려주세요 */}
        <div className={S.img}>
          <img src="/images/file-upload.png" alt="" />
        </div>
        upload image
      </label>
      <input id="fileUpload" type="file" hidden onChange={handleChange}></input>
    </div>
  );
}
export default DragDropFile;
