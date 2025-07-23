import S from "../BoardForm.module.css";

function BoardOptions() {
  return (
    <div className={S.boardOption}>
      <div className={S.boardOptionDetail}>
        <div className={S.boardTitle}>
          <label htmlFor="" hidden>
            제목
          </label>
          <input type="text" placeholder="제목을 입력해주세요" />
        </div>
        <div className={S.boardSecondOption}>
          <div>
            <label htmlFor="">모집 마감일</label>
            <div>
              <a href="">
                <img src="/icons/Calendar.png" alt="" />
                <span>2025-07-14</span>
              </a>
            </div>
          </div>
          <div>
            <label htmlFor="">모집 인원</label>
            <input type="text" />
          </div>
        </div>
        <div className={S.boardThird}>
          <div>
            <p>게시글 분류</p>
            <label htmlFor="study">
              <input type="radio" id="study" name="board_cls" />
              스터디
            </label>
            <label htmlFor="project">
              <input type="radio" id="project" name="board_cls" />
              프로젝트
            </label>
          </div>
          <div>
            <p>모집 분류</p>
            <label htmlFor="free">
              <input type="radio" id="free" name="join_cls" />
              자유가입
            </label>
            <label htmlFor="permission">
              <input type="radio" id="permission" name="join_cls" />
              승인가입
            </label>
          </div>
        </div>
      </div>
      <div className={S.boardOptionImage}>
        <img src="" alt="" />
        <button type="button">사진 첨부</button>
      </div>
    </div>
  );
}
export default BoardOptions;
