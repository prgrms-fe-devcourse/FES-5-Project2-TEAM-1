import Calender from '@/components/Calender'
import S from './ManagementChannel.module.css'

function MangementChannel() {



  return (
    <main>
      <h1 className={S.contentHeader}>프로젝트 생성</h1>
      <form>
        <h2>모집 타입</h2>
        <section className={S.category}>
            <div className={S.study}>
              <input type="radio" name="category" id="study" />
              <label htmlFor="study">스터디</label>
            </div>
            <div className={S.project}>
              <input type="radio" name="category" id="project" />
              <label htmlFor="project">프로젝트</label>
            </div>
        </section>

        <div className={S.dateContributors}>
          <section className={S.time}>
            <h2>모임 시간</h2>
            {/* <Calender/> */}
            <input type="date" name="" id=""/>
          </section>

          <section className={S.contributors}>
            <h2>모집 인원</h2>
            <div className={S.countButton}>
              <button className={S.upButton} type="button">∧</button>
              <p>0</p>
              <button className={S.downButton} type="button">∨</button>
            </div>
          </section>
        </div>

        <h2>모임 장소</h2>
        <section className={S.location}>
          <div className={S.locationRadio}>
            <div className={S.online}>
              <input type="radio" name="location" id="online" />
              <label htmlFor="online">온라인</label>
            </div>
            <div className={S.offline}>
              <input type="radio" name="location" id="offline" />
              <label htmlFor="offline">오프라인</label>
            </div>
          </div>

          {/* 온라인/오프라인에 따라 나타났다 사라졌다 or 입력가능/입력불가능 해야할듯 */}
          <input type="search" name="" id="" placeholder="Location"/>
        </section>

        <button className={S.saveButton} type="button">저장</button>
        <h2>모집 활성화</h2>
        <section className={S.isActive}>
          <div className={S.active}>
            <input type="radio" name="isActive" id="active" />
            <label htmlFor="active">활성화</label>
          </div>
          <div className={S.inactive}>
            <input type="radio" name="isActive" id="inactive" />
            <label htmlFor="inactive">비활성화</label>
          </div>
        </section>
      </form>

      <button className={S.deleteButton} type="button">채널삭제</button>
    </main>
  )
}
export default MangementChannel