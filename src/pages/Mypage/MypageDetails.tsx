import type { User } from './Mypage'
import S from './MypageTop.module.css'


interface Props {
    user: User | null;
    editMode: boolean,
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

function MypageDetails({ user, editMode, setUserData}: Props) {

    const userData = user && user.profile[0];
    if( !userData ) {
        return <div className={S.mypageDetailsContainer}>Loading...</div>;
    }

  return (
    <div className={S.mypageDetailsContainer}>
        <ul>
            <li>
                <h3>주소</h3>
                <p>{userData.address}</p>
            </li>
            <li>
                <h3>성별</h3>
                <p>{userData.gender}</p>
            </li>
            <li>
                <h3>나이</h3>
                <p>{userData.age}</p>
            </li>
        </ul>
    </div>
  )
}

export default MypageDetails