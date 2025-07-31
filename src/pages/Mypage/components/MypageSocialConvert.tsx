import type { Tables } from "@/supabase/database.types"
import compareUserId from "@/utils/compareUserId";
import { useEffect, useState } from "react"
import S from './MypageSocialConvert.module.css'
import { useCopyToClipboard } from '@uidotdev/usehooks'
import { useToast } from "@/utils/useToast";
import type { User } from "../Mypage";

type Social = Tables<'user_social'>;

function MypageSocialConvert({ user }: {user: User | null}) {

  const [socialData, setSocialData] = useState<Social[]|null>(null);
  const [copiedText, setCopy] = useCopyToClipboard();
  const { success } = useToast();

  const userSocial = user && user.profile[0].social[0];

  useEffect(()=>{
    const fetchSocial = async() => {
      if( !userSocial ) return;
      const result = await compareUserId(userSocial.profile_id, 'user_social');
      setSocialData(result);
      // console.log(result)
    }
    fetchSocial();
  },[userSocial])
  // 유저가 바뀌면서 소셜 값도 바뀔때 useEffect가 계속 실행돼야하지 않을까?

  useEffect(()=>{
    copiedText && success(`복사 완료! ${copiedText}`)
  },[copiedText])

  return ( 
    <section className={S.socialContainer}>
      {
        socialData && socialData.map(({social, social_id, social_link})=>(
          <div className={S.social} key={social_id}>
            
            <button type="button" onClick={()=>{setCopy(social_link)}} className={S.socialLink} title='복사하기' >
              {
                social === 'instagram' ? <img src="src\assets\instagram.svg" alt="instagram"/>
                : social === 'github' ? <img src="src\assets\github.svg" alt="github" />
                : social === 'discord' ? <img src="src\assets\discord.svg" alt="discord" /> 
                : <img src="src\assets\slack.svg" alt="slack" /> 
              }
            </button>
          </div>
        ))
      }
    </section>
  )
}
export default MypageSocialConvert