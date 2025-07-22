import S from "./BoardForm.module.css";

function BoardForm() {
  return (
    <form action="">
      <div className={S.bContainer}>
        <div className={S.boardEdit}>
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
          <div className={S.boardOptionSub}>
            <div className={S.hashTag}>
              <label hidden htmlFor="">
                해시태그
              </label>
              <input
                type="text"
                placeholder="#을 붙혀 해시태그를 만들어주세요!"
              />
            </div>
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
          <div className={S.boardWriteForm}>
            <textarea name="" id=""></textarea>
          </div>
        </div>
        <div className={S.boardPreview}>
          <p className={S.boardPreviewDefaultText}>Preview</p>
        </div>
      </div>
      <div className={S.boardBottonArea}>
        <button type="button">
          <img src="/icons/place.png" alt="" /> 장소 찾기
        </button>
        <div>
          <button type="button">임시 저장</button>
          <button id={S.boardWrite} type="submit">
            글 게시
          </button>
        </div>
      </div>
    </form>
  );
}
export default BoardForm;
