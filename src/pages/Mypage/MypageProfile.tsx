
import type { User } from './Mypage';
import S from './MypageTop.module.css';
import E from './MypageEdit.module.css'
import BackgroundEdit from './components/BackgroundEdit';
import { useState } from 'react';


interface Props {
  user: User | null;
  editMode: boolean;
}


  function MypageProfile({ user, editMode,  }:  Props) {

    const [showDropdown, setShowDropdown] = useState(false);
    const [prevImage, setPrevImage] = useState('');

    if (!user || !user.profile ) {
      return <p>프로필 정보가 없습니다.</p>;
    }
    
    const profileData = user.profile[0];
    console.log( profileData );

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
                { showDropdown && <BackgroundEdit prevImage={prevImage} setPrevImage={setPrevImage} setShowDropdown={setShowDropdown} /> }
            </>)
            : (<img src={profileData.background_images} className={S.mypageBgImg} />)
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
