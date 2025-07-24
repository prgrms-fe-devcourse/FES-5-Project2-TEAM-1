import type { User } from './Mypage';
import S from './MypageTop.module.css';


interface Props {
  user: User | null;
}

function MypageInterest({user}: Props) {

  const userInterest = user && user.profile[0].interest[0];
  if( !userInterest ) {
    return <div className={S.mypageInterest}>Loading...</div>;
  }

  return (
    <>
        <div className={S.mypageInterest}>
          <h2>관심분야</h2>
          <div className={S.InterestBlock}>
            <div className={S.InterestBlockEach}>
              {userInterest.interest}
            </div>
          </div>
        </div>
    </>
  )
}

export default MypageInterest