import S from './MypageTop.module.css';



function MypageDetail() {
  return (
    <>
        <div className={S.mypageName}>이름</div>
        <div className={S.mypageRole}>직무</div>
    </>
  )
}

export default MypageDetail
