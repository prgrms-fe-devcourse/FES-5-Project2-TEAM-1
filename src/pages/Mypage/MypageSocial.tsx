import type { User } from './Mypage';
import S from './MypageTop.module.css'



interface Props {
  user: User | null;
}

function MypageSocial({user}: Props) {

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
    </>
  )
}

export default MypageSocial
