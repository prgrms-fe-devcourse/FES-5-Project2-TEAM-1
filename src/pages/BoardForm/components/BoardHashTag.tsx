import S from "../BoardForm.module.css";

function BoardHashTag() {
  return (
    <div className={S.hashTag}>
      <label hidden htmlFor="">
        해시태그
      </label>
      <input type="text" placeholder="#을 붙혀 해시태그를 만들어주세요!" />
    </div>
  );
}
export default BoardHashTag;
