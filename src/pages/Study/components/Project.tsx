import S from './Project.module.css'

function Project() {
  return (
    <div className={S.container}>
      <div className={S.cardInner}>
        <img src="/images/zoom.png" alt="" />
        <ul className={S.iconList}>
          <li className={S.list}>
            <div className={S.icon}>
              <img src="/icons/map-marker-line.svg" alt="" />
            </div>
            <p>Zoom</p>
          </li>
          <li className={S.list}>
            <div className={S.icon}>
              <img src="/icons/clock.svg" alt="" />
            </div>
            <p>오전 09:00시</p>
          </li>
          <li className={S.list}>
            <div className={S.icon}>
              <img src="/icons/channelmember.svg" alt="" />
            </div>
            <p>10명</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
export default Project