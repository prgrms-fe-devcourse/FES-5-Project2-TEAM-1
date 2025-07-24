
import MypageInterest from './MypageInterest';
import MypageProfile from './MypageProfile';
import MypageSocial from './MypageSocial';
import S from './MypageTop.module.css';
import MypageName from './MypageName';
import MypageDetails from './MypageDetails';
import { useEffect, useState } from 'react';
import supabase from '../../supabase/supabase';
import type { Tables } from 'src/supabase/database.types';


// type UserBase = Tables<'user_base'>;
// type UserProfile = Tables<'user_profile'>;
// type UserInterest = Tables<'user_interest'>;
// type UserSocial = Tables<'user_social'>;

export type User = Tables<'user_base'> & {
  profile: Tables<'user_profile'>[] & {
    interest: Tables<'user_interest'>[];
    social: Tables<'user_social'>[];
  }
}

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
        .eq('id', 'test1')
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
    
    if( !userData ) return;

    const { error } = await supabase
      .from('user_profile')
      .update({
        background_images: userData.profile[0].background_images,
        profile_images: userData.profile[0].profile_images,
        address: userData.profile[0].address,
        age: userData.profile[0].age,
        email: userData.profile[0].email,
      })
      .eq('profile_id', userData.profile[0].profile_id);



    setEditMode( false );
  }

  const handleDeleteUser = () => {

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
              onChange={(updatedProfile) => {
                setUserData((prev) => prev ? { ...prev, profile: { ...prev.profile, ...updatedProfile},  } : prev)
              }} 
            />
            <MypageName user={userData} />
            <MypageDetails user={userData} />
            <MypageInterest user={userData} />
            <MypageSocial user={userData} />
            { editMode && <button type="submit" onClick={handleSave}>저장</button>}
        </div>
    </div>
  )
}

export default Mypage
