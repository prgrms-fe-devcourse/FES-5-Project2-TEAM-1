import S from './MypageTop.module.css';



function MypageInterest() {
  return (
    <>
        <div className={S.mypageInterest}>
          <h2>관심분야</h2>
          <div className={S.InterestBlock}>
            <div className={S.InterestBlockEach}>
              개발
            </div>
          </div>
        </div>
    </>
  )
}

export default MypageInterest
