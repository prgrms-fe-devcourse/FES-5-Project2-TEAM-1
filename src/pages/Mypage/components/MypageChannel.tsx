import { useEffect, useRef, useState } from "react";
import type { Tables } from "src/supabase/database.types"
import S from './MypageChannel.module.css'

import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react"
import { Navigation } from "swiper/modules"
import './MypageSwiper.css'
import 'swiper/css'; 
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import supabase from "@/supabase/supabase";
/**
 * - 참여중 스터디 확인
    - 현재 접속한 유저 id와 board_member 테이블의 profile_id가 같은게 있는지 확인하고,
    - board_member의 board_id를 기준으로 다시 board에서 board의 title, images 가져와서 카드로 뿌리기

  - 채널 링크 생성되면 채널 카드 클릭시 해당 채널 페이지로 이동하게 연결하기
  - 유저 별로 다른 데이터 불러와지도록 연결하기
 */


type Board = Tables<'board'>
type PickBoard = Pick<Board,'title'|'images'>;
type Team = {
  'board_id':string,
  'board': PickBoard
}

interface Props {
  profileId : string;
}

function MypageChannel({profileId}:Props) {
  const [teams, setTeams] = useState<Team[]|null>(null);
  const [swiper, setSwiper] = useState<SwiperClass>();
  const swiperWrappedRef = useRef<HTMLElement|null>(null);


  useEffect( () => {
    const fetchChannels = async() => {
      const {data, error} = await supabase
      .from('board_member')
      .select(`
        board_id,
        board(
          title,
          images
        )
      `)
      .eq('profile_id',profileId);

      if(error) return console.error('팀 불러오기 실패')

      const refinedBoardIsNotArray : Team[] = (data as any[]).map( row => (
        {
          board_id: row.board_id,
          board: Array.isArray(row.board) ? row.board[0] : row.board
        }
      ))

      setTeams(refinedBoardIsNotArray);
    };
    fetchChannels();
    // console.log('가입 채널 패치 완료');
  },[profileId])

  const adjustMargin = () => {
    const screenWidth = window.innerWidth;

    if(swiperWrappedRef.current){
      swiperWrappedRef.current.style.marginLeft =
      screenWidth <= 640 ? "0px" :
      screenWidth <= 768 ? "-100px" :
      screenWidth <= 1024 ? "-200px" : "-220px";
    }
  }

  useEffect(()=>{
    adjustMargin();
    window.addEventListener("resize", adjustMargin);
    return () => window.removeEventListener("resize", adjustMargin);
  }, []);

  const handlePrev = () => {
    if(!swiper) return;
    swiper.slidePrev()
  }

  const handleNext = () => {
    if(!swiper) return;
    swiper.slideNext()
  }

  return (
    <>
      <h2 className={S.sectionName}>참여중인 스터디</h2>
      <section className={S.teamContainer}>
        <button type="button" className={S.prevButton} onClick={handlePrev}>
          <img src="/src/assets/arrowLeft.svg" alt="피어리뷰 좌측 네비게이션" />
        </button>
        <Swiper 
          className="team"
          modules={[Navigation]}
          initialSlide={0}
          centeredSlides = {true}
          slidesPerView="auto"
          speed={900}
          spaceBetween={32}
          breakpoints={{
            640: {spaceBetween: 20},
            768: {spaceBetween: 30},
            1024: {spaceBetween: 40},
          }}
          onSwiper={(e) => {
            swiperWrappedRef.current = e.wrapperEl;
            setSwiper(e);
          }}
        >
          {
            teams && teams.map(({board, board_id})=>(
              <SwiperSlide key={board_id} className="team">
                <div className={S.teamCard}>
                  <img className={S.teamImg} src={board.images ? board.images : 'defaultBackground.img'} alt="채널" />
                  <p className={S.teamTitle}>{board.title}</p>
                </div>
              </SwiperSlide>
            ))
          }
        </Swiper>
        <button type="button" className={S.nextButton} onClick={handleNext}>
          <img src="/src/assets/arrowRight.svg" alt="피어리뷰 우측 네비게이션" />
        </button>
      </section>
    </>
  )
}
export default MypageChannel