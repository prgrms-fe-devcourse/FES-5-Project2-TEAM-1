import type { User } from './Mypage';
import S from './MypageTop.module.css';


interface Props {
  user: User | null;
}


function MypageName({ user }: Props) {

   if( !user ) {
      return <p>프로필 정보가 없습니다.</p>;
    }

  return (
    <div className={S.mypageNameContainer}>
        <span className={S.mypageName}>
          {user.name}
        </span>
        <span> </span>
        <span className={S.mypageRole}>
          {user.role}
        </span>
    </div>
  )
}

export default MypageName