import MypageSocialConvert from './components/MypageSocialConvert';
import type { User } from './Mypage';
import S from './MypageTop.module.css'
import E from './MypageEdit.module.css';
import { useEffect, useRef, useState } from 'react';
import compareUserId from '@/utils/compareUserId';
import type { Tables } from '@/supabase/database.types';

import Instagram from '@/assets/instagram.svg';
import Github from '@/assets/github.svg';
import Discord from '@/assets/discord.svg';
import Slack from '@/assets/slack.svg';
import Linkedin from '@/assets/linkedin.png';
import Facebook from '@/assets/facebook.png';
import Line from '@/assets/line.png';
import Youtube from '@/assets/youtube.png';
import DefaultIcon from '/images/너굴.png';
import supabase from '@/supabase/supabase';
import { useToast } from '@/utils/useToast';



interface Props {
  user: User | null;
  editMode: boolean,
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

type Social = Tables<'user_social'>;

function MypageSocial({user, editMode, setUserData}: Props) {

  const [socialArray, setSocialArray] = useState<Social[] | null>(null);
  const [isClicked, setIsClicked] = useState<boolean[]>([false, false, false]);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [pendingIcon, setPendingIcon] = useState<string[]>([]);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const userSocial = user && user.profile[0].social[0];

  const { success, error } = useToast();

  useEffect(() => {
    const fetchSocial = async () => {
      if( !userSocial ) return;
      const result = await compareUserId(userSocial.profile_id, 'user_social');
      setSocialArray(result);
    }

    fetchSocial();
  }, [userSocial])

useEffect(() => {
    if (!socialArray) return;
  const links = socialArray.map(s => s.social_link);
  setInputValues(links);
  const socials = socialArray.map(s=>s.social);
  setPendingIcon(socials);
}, [socialArray])

  useEffect(() => {
    if( !editMode ) {
      setIsClicked((prev) => prev.map(() => false) );
    }
  }, [editMode])

  if( !userSocial ) {
      return <div className={S.mypageSocial}>Loading...</div>;
  }

  // const { profile_id, social_id, social, social_link } = userSocial;

  const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement>, index: number) => {

    const newInputValue = e.currentTarget.value;

    setInputValues((prev) => {
      const newArr = [...prev];
      newArr[index] = newInputValue;
      return newArr;
    })

      setPendingIcon((prev) => {
        const newArr = [...prev];
        if( newInputValue.includes('instagram') ) newArr[index] = 'instagram';
        else if( newInputValue.includes('github') ) newArr[index] = 'github';
        else if( newInputValue.includes('facebook') ) newArr[index] = 'facebook';
        else if( newInputValue.includes('youtube') ) newArr[index] = 'youtube';
        else if( newInputValue.includes('linkedin') ) newArr[index] = 'linkedin';

        return newArr;
      })
    
  }

  const handleIconList = ( i: number ) => {
    setIsClicked((prev) => {
      return prev.map((clicked, index) => index === i ? !clicked : false );
    })
  }

  const handleClickedIcon = ( e: React.MouseEvent<HTMLImageElement>, index: number) => {

    const newSocial = e.currentTarget.alt;
    setPendingIcon((prev) => {
      const newArr = [...prev];
      newArr[index] = newSocial;
      return newArr;
    })

    setIsClicked((prev) => prev.map(() => false) );
  }

  const handleSocialSave = async (index: number) => {

    if (!userSocial || !socialArray || !socialArray[index]) return;

    const { profile_id } = userSocial;
    const { social_id } = socialArray[index];
    const newSocial = pendingIcon[index];
    const newSocialLink = inputValues[index];

    setSocialArray((prev) => {
      if (!prev) return prev;
      return prev.map((a, i) => {
        if( i === index ) {
          return { ...a, social_link: newSocialLink, social: newSocial}
        }
        return a;
      });
    })

    const { error: socialError } = await supabase
      .from('user_social')
      .update({ 
        'social': newSocial,
        'social_link': newSocialLink
      })
      .match({
        'profile_id': profile_id,
        'social_id': social_id
      })

    console.log( profile_id, social_id);

    if( socialError ) {
      error('업로드 실패');
      return;
    }

    setUserData((prev) => {
            if( !prev ) return prev;

            const prevSocial = prev.profile[0].social?.[0] || {};

            return {
                ...prev,
                profile: [{
                     ...prev.profile[0],
                     social: [{
                        ...prevSocial,
                        social: newSocial,
                        social_link: newSocialLink
                     }]
                }]
            }
    })

    success('새 링크 저장 성공!');
  }

  const iconSrc = ( index: number ) => {
    const icon = pendingIcon[index];

    return icon === 'instagram' ? Instagram :
          icon === 'github'    ? Github :
          icon === 'discord'   ? Discord :
          icon === 'slack'     ? Slack :
          icon === 'facebook'    ? Facebook :
          icon === 'linkedin'   ? Linkedin :
          icon === 'line'     ? Line :
          icon === 'youtube'      ? Youtube :
          DefaultIcon;
  }
  
  return (
    <>
        <div className={S.mypageSocial}>
          <h2>소셜링크</h2>
          { editMode
            ? ( socialArray && socialArray.map((s, i) => (
                <div key={s.social_id} className={E.editSocialWrapper}>
                  <div>
                    <button type='button' onClick={()  => handleIconList(i)}>
                      <img key={i} src={iconSrc(i) }
                            alt={`${pendingIcon[i]} icon`}
                       />
                    </button>
                    { isClicked[i] &&
                      <div className={E.editIconList}>
                        <ul>
                          <li><img onClick={(e) => {handleClickedIcon(e, i)}} src={Instagram} alt='instagram' /></li>
                          <li><img onClick={(e) => {handleClickedIcon(e, i)}} src={Github} alt='github'  /></li>
                          <li><img onClick={(e) => {handleClickedIcon(e, i)}} src={Discord} alt='discord' /></li>
                          <li><img onClick={(e) => {handleClickedIcon(e, i)}} src={Slack} alt='slack'  /></li>
                          <li><img onClick={(e) => {handleClickedIcon(e, i)}} src={Facebook} alt='facebook' /></li>
                          <li><img onClick={(e) => {handleClickedIcon(e, i)}} src={Line} alt='line'  /></li>
                          <li><img onClick={(e) => {handleClickedIcon(e, i)}} src={Linkedin} alt='linkedin' /></li>
                          <li><img onClick={(e) => {handleClickedIcon(e, i)}} src={Youtube} alt='youtube'  /></li>
                          <li><img onClick={(e) => {handleClickedIcon(e, i)}} src={DefaultIcon} alt='personal website'  /></li>
                        </ul>
                      </div>
                    }
                  </div>
                  <div className={E.editSocialInput}>
                    <input ref={el => { if (el) inputRefs.current[i] = el; }} onChange={e => handleInputChange(e, i)} defaultValue={s.social_link}  />
                  </div>
                  <div className={E.editSocialSaveBtn}>
                    <button onClick={() => handleSocialSave(i)}>저장</button>
                  </div>
                </div>
              )))
            : <MypageSocialConvert
              user={user}
            />
          }
        </div> 
    </>
  )
}

export default MypageSocial