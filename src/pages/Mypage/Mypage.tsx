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
import { showErrorAlert } from '@/utils/sweetAlert';


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
  const [urlUserData, setUrlUserData] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [urlUserId, setUrlUserId] = useState<string | null>(null);
  const {user, isLoading, profileId}  = useAuth();
  const [currentUser, setCurrentUser] = useState<CurrentUser>({profileId:'', email:'', id:''});
  const {id:urlProfileId} = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if(!isLoading && !user) {
      showErrorAlert("로그인 후 이용해주세요");
      navigate("/login");
      return;
    }
    if (!isLoading && user && profileId) {
      setCurrentUser({
        profileId,
        email: user.email,
        id: user.id,
      });
    }
  }, [isLoading, user, profileId]);


  useEffect(()=>{
    if(!urlProfileId) return;
    const fetchUrlUserId = async()=>{
      const {data, error} = await supabase
        .from('user_profile')
        .select('user_id')
        .eq('profile_id',urlProfileId)
        .single();
      if(error) {
        console.error( error );
        return null;
      }
      setUrlUserId(data.user_id);
    }
    fetchUrlUserId();
  },[urlProfileId])

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

  useEffect(() => {
    const fetchUrlUser = async () => {
      if( !urlUserId ) return;
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
        .eq('id', urlUserId)
        .single();
        if( data ) {
          setUrlUserData( data as unknown as User );
        }
        if( error ) {
          console.error( error );
          return null;
        }
    }
    fetchUrlUser();
  }, [urlUserId])

  const handleEditUserPage = () => {
    setEditMode( prev => !prev );
  }

  if (!userData) {
    return <p>유저 데이터를 불러오는 중입니다...</p>;
  }
  
  if(urlProfileId && !urlUserData){
    return <p>유저 데이터를 불러오는 중입니다...</p>;
  }

  return (
    <div className={S.container}>
      
        <div className={S.wrapper}>
            <h1 className={S.mypage}>마이 페이지</h1>
            {
              urlProfileId === currentUser.profileId && (
                <button type='button' className={S.editBtn} onClick={handleEditUserPage}>
                  {editMode ? '완료' : <img src='/icons/edit.svg' alt='수정 버튼' />}
                </button>
              )
            }
            <MypageProfile
              user={urlProfileId ? urlUserData : userData}
              editMode={editMode}
              setUserData={urlProfileId ? setUrlUserData : setUserData}
            />
            <MypageName
              user={urlProfileId ? urlUserData : userData}
              editMode={editMode}
              setUserData={urlProfileId ? setUrlUserData : setUserData}
            />
            <MypageDetails
              user={urlProfileId ? urlUserData : userData}
              editMode={editMode}
              setUserData={urlProfileId ? setUrlUserData : setUserData}
              />
            <MypageInterest
              user={urlProfileId ? urlUserData : userData}
              editMode={editMode}
              setUserData={urlProfileId ? setUrlUserData : setUserData}
              />
            <MypageSocial
              user={urlProfileId ? urlUserData : userData}
              editMode={editMode}
              setUserData={urlProfileId ? setUrlUserData : setUserData}
              />
         
            <MypagePeerReview profileId={urlProfileId ? urlProfileId : currentUser.profileId}/>
            <MypageChannel profileId={urlProfileId ? urlProfileId : currentUser.profileId}/>
            { 
              urlProfileId === currentUser.profileId ? 
              <MypageScrap profileId={urlProfileId}/> : ''
            }
            <MypagePost profileId={urlProfileId ? urlProfileId : currentUser.profileId}/>
            <MoveToTop/>

        </div>
    </div>
  )
}
export default Mypage