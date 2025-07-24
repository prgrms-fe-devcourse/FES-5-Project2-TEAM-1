
import type { User } from './Mypage';
import S from './MypageTop.module.css';
import E from './MypageEdit.module.css'
import BackgroundEdit from './components/BackgroundEdit';
import { useState } from 'react';


interface Props {
  user: User | null;
  editMode: boolean;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}


  function MypageProfile({ user, editMode, setUserData }:  Props) {

    const [showDropdown, setShowDropdown] = useState(false);
    const [prevImage, setPrevImage] = useState('');

    if (!user || !user.profile ) {
      return <p>프로필 정보가 없습니다.</p>;
    }
    
    const profileData = user.profile[0];

    const handleEditBackground = () => {
      setShowDropdown(prev => !prev);
      setPrevImage(profileData.background_images);
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
          <img src={profileData.profile_images} />
        </div>
      </div>
    </>
  )
}

export default MypageProfile
