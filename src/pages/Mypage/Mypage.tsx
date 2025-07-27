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

// type UserBase = Tables<'user_base'>;
// type UserProfile = Tables<'user_profile'>;
// type UserInterest = Tables<'user_interest'>;
// type UserSocial = Tables<'user_social'>;
type UserProfileWithJoins = Tables<'user_profile'> & {
  interest: Tables<'user_interest'>[];
  social: Tables<'user_social'>[];
};
export type User = Tables<'user_base'> & {
  profile: UserProfileWithJoins[];
};
function Mypage() {

  const [userData, setUserData] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
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
        .eq('id', 'e6fd8f91-4bc2-40a4-99e2-a821401129e2')
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
  }, [ ])

  const handleEditUserPage = () => {
    setEditMode( prev => !prev );
  }
  const handleSave = async () => {
    setEditMode( false );
  }

  if (!userData) {
    return <p>유저 데이터를 불러오는 중입니다...</p>;
  }

  return (
    <div className={S.container}>
        <div className={S.wrapper}>
            <h1 className={S.mypage}>마이 페이지</h1>
            <button type='button' className={S.editBtn} onClick={handleEditUserPage}>
              {editMode ? '취소' : <img src='/icons/edit.svg' alt='수정 버튼' />}
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
              user={userData} />
            <MypageSocial
              user={userData} />
            <MypagePeerReview/>
            <MypageChannel/>
            <MypageScrap/>
            <MypagePost/>
            { editMode && <button type="submit" onClick={handleSave}>완료</button>}
        </div>
    </div>
  )
}
export default Mypage