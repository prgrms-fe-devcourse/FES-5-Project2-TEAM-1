import MypageSocialConvert from './components/MypageSocialConvert';
import type { User } from './Mypage';
import S from './MypageTop.module.css'



interface Props {
  user: User | null;
  editMode: boolean,
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

function MypageSocial({user, editMode, setUserData}: Props) {

  const userSocial = user && user.profile[0].social[0];
  if( !userSocial ) {
      return <div className={S.mypageSocial}>Loading...</div>;
  }

  return (
    <>
        <div className={S.mypageSocial}>
          <h2>소셜링크</h2>
          <div>
            {userSocial.social}
          </div>
        </div> 
        {/* edit 모드 아닐때 MapyaSocialConvert 렌더링 */}
        <MypageSocialConvert/>
    </>
  )
}

export default MypageSocial