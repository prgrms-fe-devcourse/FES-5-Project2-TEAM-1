import S from './studyChannel.module.css'
import "../../style/reset.css"

function StudyChannel() {
  return (
    <main className={S.container}>
      <nav>
        <div className={S.filterTab}>
          <button type="button">모집마감순</button>
          <button type="button">좋아요순</button>
        </div>
        <form >
          <input type="text" placeholder='검색어를 입력하세요' />
        </form>
        <button type="button">글쓰기</button>
      </nav>
    </main>
  )
}
export default StudyChannel