import S from "../BoardForm.module.css";

interface Props {
  onInput: (e: React.InputEvent<HTMLTextAreaElement>) => void;
}

function BoardWriteForm({ onInput }: Props) {
  //입력 받을 때 마다 preview로 데이터 넘기기

  return (
    <div className={S.boardWriteForm}>
      <textarea name="postContent" onInput={onInput}></textarea>
    </div>
  );
}
export default BoardWriteForm;
