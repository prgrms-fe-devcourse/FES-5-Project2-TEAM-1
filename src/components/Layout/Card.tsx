import S from './card.module.css'

import { useEffect, useState } from 'react';
import supabase from '@/supabase/supabase';
import { useNavigate } from 'react-router-dom';
import type { Tables } from '@/supabase/database.types';






type BoardTag =  {
  board_tag : Tables<'board_tag'>[]
}
type Board = Tables<'board'>

type CardProps = Board & BoardTag

function Card(card:CardProps) {
  const {address,contents,due_date,title,likes,board_id,join_cls,member,profile_id} = card
  const {board_tag} = card
  console.log(board_tag)

   
    const [cardLike, setCardLike] = useState(likes);
    const [isPressed, setIsPressed] = useState(false);
    const [isScrap, setIsScrap] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
      const storedLike = JSON.parse(localStorage.getItem(`like-${board_id}`) ?? "false")  
      const storedScrap = JSON.parse(localStorage.getItem(`scrap-${board_id}`) ?? "false")  
      setIsPressed(storedLike)
      setIsScrap(storedScrap)
    }, [board_id]);

    const handleScrap = async () => {
    const nextScrapState = !isScrap
    setIsScrap(nextScrapState)
    localStorage.setItem(`scrap-${board_id}`, JSON.stringify(nextScrapState));
    
    const { data, error } = await supabase
      .from("scrap")
      .select("*").eq('profile_id',profile_id).eq('board_id',board_id).single()
    
      if (data?.scrap_id) {
        await supabase.from('scrap').delete().eq('scrap_id',data.scrap_id)  
      } else {
        await supabase.from('scrap').insert([{
          scrap_id: `scrap${Date.now()}`,
          profile_id,
          board_id,
        }])
      }
    
    if (error) {
      console.error("데이터를 제대로 불러오지 못하였습니다");
      setIsScrap(!isScrap)
    }
    }
      
    const handleLike = async () => {
    const pressState = isPressed ? cardLike - 1 : cardLike + 1;
    const nextState = !isPressed;
   
    setCardLike(pressState);
    setIsPressed(!isPressed)
    localStorage.setItem(`like-${board_id}`,JSON.stringify(nextState))
  
      const { error } = await supabase.from('board').update({ likes: pressState}).eq('board_id', board_id)
      
      if (error) {
        console.error('좋아요 업데이트 실패', error.message)
        setCardLike(isPressed ? cardLike - 1 : cardLike + 1)
        setIsPressed(!isPressed)
         localStorage.setItem(`like-${board_id}`, JSON.stringify(nextState));
      }
    }

    const handleRoute = (e:React.MouseEvent<HTMLDivElement, MouseEvent>,card:CardProps) => {
      e.preventDefault()

      if ((e.target as HTMLButtonElement).closest('button')) {
        return
      } else {
       navigate(`/study/${board_id}`,{state : {card}})
      }
  }
  
  return (
    <div className={S.container} onClick={(e) => handleRoute(e, card)}>
      <div className={S.cardTop}>
        <div className={S.cardTopLeft}>
          <div className={join_cls == "0" ? S.freebadge : S.acceptbadge}>
            {join_cls == "0" ? "자유가입" : "승인가입"}
          </div>
          <div>모집기간 D-{due_date}</div>
        </div>
        <div className={S.cardTopRight}>
          <button className={S.scrapBtn} onClick={handleScrap}>
            {isScrap ? (
              <img src="/icons/scraplittleActive.png" alt="스크랩 활성화" />
            ) : (
              <img src="/icons/scraplittle.svg" alt="스크랩 비 활성화" />
            )}
          </button>
          <button className={S.likeBtn} onClick={handleLike}>
            {isPressed ? (
              <img src="/icons/likeActive.png" alt="" />
            ) : (
              <img src="/icons/like.svg" alt="" />
            )}
            {cardLike}
          </button>
        </div>
      </div>
      <div className={S.titleBox}>
        <h4>{title}</h4>
        <p>{contents}</p>
      </div>
      <div className={S.tagBox}>
        {/* {
          board_tag.map((t) => <div className={S.tagStyle}>{t.hash_tag}</div>)
        } */}
        <span>
          <svg
            width="3"
            height="3"
            viewBox="0 0 3 3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.50935 2.55176C0.948598 2.55176 0.5 2.10316 0.5 1.5611C0.5 1.00036 0.948598 0.551758 1.50935 0.551758C2.0514 0.551758 2.5 1.00036 2.5 1.5611C2.5 2.10316 2.0514 2.55176 1.50935 2.55176Z"
              fill="#555555"
              fillOpacity="0.7"
            />
          </svg>
        </span>{" "}
        {address}
        <span>
          <svg
            width="3"
            height="3"
            viewBox="0 0 3 3"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.50935 2.55176C0.948598 2.55176 0.5 2.10316 0.5 1.5611C0.5 1.00036 0.948598 0.551758 1.50935 0.551758C2.0514 0.551758 2.5 1.00036 2.5 1.5611C2.5 2.10316 2.0514 2.55176 1.50935 2.55176Z"
              fill="#555555"
              fillOpacity="0.7"
            />
          </svg>
        </span>
        <span>
          <svg
            width="12"
            height="14"
            viewBox="0 0 12 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="5.87206"
              cy="4.18212"
              r="2.81395"
              fill="#555555"
              fillOpacity="0.5"
            />
            <path
              d="M0.244141 9.74024C0.244141 8.63567 1.13957 7.74023 2.24414 7.74023H9.49995C10.6045 7.74023 11.4999 8.63566 11.4999 9.74023V13.3681H0.244141V9.74024Z"
              fill="#555555"
              fillOpacity="0.5"
            />
          </svg>
        </span>
        {member}
      </div>
    </div>
  );
}
export default Card

