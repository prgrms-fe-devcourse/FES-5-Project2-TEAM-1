import MypageChannel from './MypageChannel';
import MypageDetail from './MypageDetail';
import MypageInterest from './MypageInterest';
import MypagePeerReview from './MypagePeerReview';
import MypagePost from './MypagePost';
import MypageProfile from './MypageProfile';
import MypageScrap from './MypageScrap';
import MypageSocial from './MypageSocial';
import sTop from './MypageTop.module.css';
import sBottom from './MypageBottom.module.css';



function Mypage() {
  return (
    <div style={{display:"flex", flexDirection:"column"}}>
      {
        /* <div className={sTop.container}>
            <div className={sTop.wrapper}>
                <h1 className={sTop.mypage}>마이 페이지</h1>
                <MypageProfile />
                <MypageDetail />
                <MypageInterest />
                <MypageSocial />
            </div>
        </div> */
      }
      <div className={sBottom.container}>
        <div className={sBottom.peerReview}>
          <MypagePeerReview/>
        </div>
        <div className={sBottom.channel}>
          <MypageChannel/>
        </div>
        <div className={sBottom.scrap}>
          <MypageScrap/>
        </div>
        <div className={sBottom.post}>
          <MypagePost/>
        </div>
      </div>
    </div>
    
  )
}

export default Mypage
