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
import DeleteAccount from './components/DeleteAccount';
import { useParams } from 'react-router-dom';


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
  const [showEdit, setShowEdit] = useState(false);
  const [profileId, setProfileId] = useState('');
  const {user:currentUser}  = useAuth();
  const {id:urlProfileId} = useParams();


  useEffect(()=>{
    const fetchUserProfile = async() => {
      if(!currentUser) return;
      const { data, error} = await supabase
        .from("user_profile")
        .select("profile_id")
        .eq("user_id", currentUser.id)
        .single(); // 싱글이어도 객체를 반환한다는거 잊지않기...☆
      if (error || !data) {
        console.error("user_base 조회 실패", error);
        return;
      }
      // 여기서 setter에 바로 data를 넣어주니까 계속 데이터가 안불러와졌던거임.. ㅋ
      const {profile_id} = data;
      console.log(profile_id);
      setProfileId(profile_id);
    }
    fetchUserProfile();
  },[currentUser])

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
//   const handleDeleteUser = () => {
//     //
//   }
  return (
    <div className={S.container}>
      
        <div className={S.wrapper}>
            <h1 className={S.mypage}>마이 페이지</h1>
            <button type='button' className={S.editBtn} onClick={handleEditUserPage}>
              {editMode ? '취소' : <img src='/icons/edit.svg' alt='수정 버튼' />}
            </button>
            {/* <TestGetUser/> */}
            <MypageProfile
              user={userData}
              editMode={editMode}
              setUserData={setUserData}
            />
            <MypageName
              user={userData}
              editMode={editMode}
              setUserData={setUserData}
              showEdit={showEdit}
              setShowEdit={setShowEdit}
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
         
            <MypagePeerReview profileId={profileId}/>
            <MypageChannel profileId={profileId}/>
            { // 현재 접속한 유저와 조회한 마이페이지 주인이 같을때만 렌더링
              urlProfileId === profileId ? 
              <MypageScrap profileId={profileId}/> : ''
            }
            <MypagePost profileId={profileId}/>
            { // 현재 접속한 유저와 조회한 마이페이지 주인이 같을때만 렌더링
              urlProfileId === profileId ? 
              <DeleteAccount profileId={profileId}/> : ''
            }
            <MoveToTop/>

            { editMode && <button type="submit" onClick={handleSave}>완료</button>}
        </div>
    </div>
  )
}
export default Mypage