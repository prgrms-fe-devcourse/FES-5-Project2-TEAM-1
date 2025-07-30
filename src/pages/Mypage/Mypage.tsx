import MypageInterest from './MypageInterest';
import MypageProfile from './MypageProfile';
import MypageSocial from './MypageSocial';
import S from './MypageTop.module.css';
import MypageName from './MypageName';
import MypageDetails from './MypageDetails';
import { useEffect, useState } from 'react';
import supabase from '../../supabase/supabase';
import type { Tables } from 'src/supabase/database.types';
import MypageChannel from './components/MypageChannel';
import MypagePeerReview from './components/MypagePeerReview';
import MypagePost from './components/MypagePost';
import MypageScrap from './components/MypageScrap';
import MoveToTop from './components/MoveToTop';
import { useAuth } from '@/auth/AuthProvider';
import { useNavigate, useParams } from 'react-router-dom';
import type { UUID } from 'crypto';


type UserProfileWithJoins = Tables<'user_profile'> & {
  interest: Tables<'user_interest'>[];
  social: Tables<'user_social'>[];
};
export type User = Tables<'user_base'> & {
  profile: UserProfileWithJoins[];
};

type CurrentUser = {
  profileId:string;
  email:string;
  id:string;
}

function Mypage() {
  const [userData, setUserData] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const {user, isLoading}  = useAuth();
  const [currentUser, setCurrentUser] = useState<CurrentUser>({profileId:'', email:'', id:''});
  const {id:urlProfileId} = useParams();
  const navigate = useNavigate();

  useEffect(()=>{
    console.log(user);
    if(!user) {
      console.error('로그인이 필요합니다');
      // 로그인 후 이용해달라는 alert 줄 지 고민
      // navigate("/login");
      return;
    }
    setCurrentUser({
      profileId: user.profileId, 
      email: user.email, 
      id: user.id
    });
    console.log(currentUser);
      
  },[isLoading])

  useEffect(() => {
    const fetchUser = async () => {
      if( !currentUser.id ) return;
      const { data, error } = await supabase
        .from('user_base')
        .select(`
          *,
          profile: user_profile(
          *,
          interest: user_interest(*),
          social: user_social(*)
          )
          `)
        .eq('id', currentUser.id)
        .single();
        if( data ) {
          setUserData( data as unknown as User );
        }
        if( error ) {
          console.error( error );
          return null;
        }
    }
    fetchUser();
  }, [currentUser])

  const handleEditUserPage = () => {
    setEditMode( prev => !prev );
  }

  if (!userData) {
    return <p>유저 데이터를 불러오는 중입니다...</p>;
  }

  return (
    <div className={S.container}>
      
        <div className={S.wrapper}>
            <h1 className={S.mypage}>마이 페이지</h1>
            <button type='button' className={S.editBtn} onClick={handleEditUserPage}>
              {editMode ? '완료' : <img src='/icons/edit.svg' alt='수정 버튼' />}
            </button>
            <MypageProfile
              user={userData}
              editMode={editMode}
              setUserData={setUserData}
            />
            <MypageName
              user={userData}
              editMode={editMode}
              setUserData={setUserData}
            />
            <MypageDetails
              user={userData}
              editMode={editMode}
              setUserData={setUserData}
              />
            <MypageInterest
              user={userData}
              editMode={editMode}
              setUserData={setUserData}
              />
            <MypageSocial
              user={userData}
              editMode={editMode}
              setUserData={setUserData}
              />
         
            <MypagePeerReview profileId={currentUser.profileId}/>
            <MypageChannel profileId={currentUser.profileId}/>
            { // 현재 접속한 유저와 조회한 마이페이지 주인이 같을때만 렌더링
              urlProfileId === currentUser.profileId ? 
              <MypageScrap profileId={currentUser.profileId}/> : ''
            }
            <MypagePost profileId={currentUser.profileId}/>
            <MoveToTop/>

        </div>
    </div>
  )
}
export default Mypage