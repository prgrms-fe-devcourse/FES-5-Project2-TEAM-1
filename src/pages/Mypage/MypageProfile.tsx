import type { User } from './Mypage';
import S from './MypageTop.module.css';
import E from './MypageEdit.module.css'
import BackgroundEdit from './components/BackgroundEdit';
import { useState } from 'react';
import ProfileEdit from './components/ProfileEdit';


interface Props {
  user: User | null;
  editMode: boolean;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}


  function MypageProfile({ user, editMode, setUserData }:  Props) {

    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfileDrop, setShowProfileDrop] = useState(false);
    const [prevImage, setPrevImage] = useState('');
    const [prevProfileImage, setPrevProfileImage] = useState('');

    if (!user || !user.profile ) {
      return <p>프로필 정보가 없습니다.</p>;
    }
    
    const profileData = user.profile[0];

    const handleEditBackground = () => {
      setShowDropdown(true);
      setPrevImage(profileData.background_images);
    }

    const handleEditProfile = () => {
      setShowProfileDrop(true);
      setPrevProfileImage(profileData.profile_images);
    }

    return (
    <>
      <div className={S.mypageProfileContainer}>
        <div className={S.mypageBg}>
          { editMode ?
            (<>
                <img src={profileData.background_images} className={E.edit_mypageBg} />
                <button type='button' className={E.edit_mypageBgBtn} onClick={handleEditBackground}>
                  <img src='/icons/edit_pencil.svg' />
                </button>
                { showDropdown && 
                  <BackgroundEdit 
                    prevImage={prevImage} 
                    setPrevImage={setPrevImage} 
                    setShowDropdown={setShowDropdown}
                    profileData={profileData}
                    setUserData={setUserData}  
                /> }
            </>)
            : (<img
                  key={profileData.background_images} 
                  src={profileData.background_images} 
                  className={S.mypageBgImg}
               />)
          }
        </div>
        <div className={S.mypageProfile}>
          {
            editMode 
            ? ( 
              <>
                <button type="button" onClick={handleEditProfile} className={E.editProfileBtn}>
                  <img src={profileData.profile_images} className={E.editProfileImg} />
                </button>
                { showProfileDrop && 
                  <ProfileEdit 
                    prevProfileImage={prevProfileImage} 
                    setPrevProfileImage={setPrevProfileImage} 
                    setShowProfileDrop={setShowProfileDrop}
                    profileData={profileData}
                    setUserData={setUserData}  
                  />
                }
              </> 
            )
            : ( <img src={profileData.profile_images} className={S.mypageProfileImg} />)
          }
        </div>
      </div>
    </>
  )
}

export default MypageProfile