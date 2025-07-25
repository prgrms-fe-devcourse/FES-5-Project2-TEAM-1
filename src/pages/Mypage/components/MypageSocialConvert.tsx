/**
 * 1. 유저에 대한 소셜 데이터 불러오기
 * 3. discord/slack/instagram/github/gmail(메일)에 따라서 아이콘 렌더링
 */

import type { Tables } from "@/supabase/database.types"
import compareUserId from "@/utils/compareUserId";
import { useEffect, useState } from "react"
import S from './MypageSocialConvert.module.css'
import { useCopyToClipboard } from '@uidotdev/usehooks'

type Social = Tables<'user_social'>;

function MypageSocialConvert() {
  
  const [socialData, setSocialData] = useState<Social[]|null>(null);
  // const [convertSocialData, setConvertSocialData] = useState<ConvertSocial[]|null>(null);

  useEffect(()=>{
    const fetchSocial = async() => {
      const result = await compareUserId('11e880fd-65ca-4778-b8e9-1888c1e65233','user_social');
      setSocialData(result);
      console.log(result)
    }
    fetchSocial();
  },[])

  // useEffect(()=>{
  //   const convertSocial = () => {
  //     // switch의 리턴을 jsx로 하고 그걸 리스트에 푸쉬해서 한 번에 렌더링한다면?
  //     // 아니면 jsx문에서 바로 삼항식을 수행하거나
  //     if(!socialData) return;
  //     const result = socialData.map((data)=>{
  //       const {social, social_link} = data

  //       switch (social) {
  //         case 'instagram':
  //           return {img:'/assets/instagram.svg', socialLink:social_link};        
  //         case 'discord':      
  //           return {img:'/assets/discord.svg', socialLink:social_link};
  //         case 'github':
  //           return {img:'/assets/github.svg', socialLink:social_link};
  //         case 'slack':
  //           return {img:'/assets/slack.svg', socialLink:social_link};
  //       }
  //     })
  //     setConvertSocialData(result);

  //   }
  //   convertSocial();
  // },[])
  

  // 

  /**
   * 유효한 링크 형식이면 링크 이동 
   * 아니라면 링크 복사
   */
  const [copiedText, setCopy] = useCopyToClipboard();

  return ( 
    <div className={S.socialContainer}>
      {
        socialData && socialData.map(({social, social_id, social_link})=>(
          <div className={S.social} key={social_id}>
            
            <button type="button" onClick={()=>setCopy(social_link)} className={S.socialLink} title='복사하기' >
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
      {copiedText&&<p>복사 완료! : {copiedText}</p>}
    </div>
  )
}
export default MypageSocialConvert