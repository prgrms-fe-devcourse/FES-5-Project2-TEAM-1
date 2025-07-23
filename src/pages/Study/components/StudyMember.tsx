import S from './StudyMember.module.css'

function StudyMember() {
  return (
    <div className={S.container}>
      <div className={S.member}>
        <img src="/images/너굴.png" alt="" />
        <p>이름</p>
      </div>
      <button type="button" className={S.showmore}>
        <svg
          width="8"
          height="3"
          viewBox="0 0 8 3"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="1" cy="1.39697" r="1" fill="#222222" />
          <circle cx="4" cy="1.39697" r="1" fill="#222222" />
          <circle cx="7" cy="1.39697" r="1" fill="#222222" />
        </svg>
      </button>
    </div>
  );
}
export default StudyMember