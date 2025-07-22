import S from './MypageTop.module.css';



function MypageName() {
  return (
    <div className={S.mypageNameContainer}>
        <span className={S.mypageName}>Eunbin</span>
        <span> </span>
        <span className={S.mypageRole}>Frontend</span>
    </div>
  )
}

export default MypageName
