
import MypageInterest from './MypageInterest';
import MypageProfile from './MypageProfile';
import MypageSocial from './MypageSocial';
import S from './MypageTop.module.css';
import MypageName from './MypageName';
import MypageDetails from './MypageDetails';



function Mypage() {
  return (
    <div className={S.container}>
        <div className={S.wrapper}>
            <h1 className={S.mypage}>마이 페이지</h1>
            <MypageProfile />
            <MypageName />
            <MypageDetails />
            <MypageInterest />
            <MypageSocial />
        </div>
    </div>
  )
}

export default Mypage
