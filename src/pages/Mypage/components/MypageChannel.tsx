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
import { Link } from "react-router-dom";

type Team = Tables<'approve_member'> & {
  board?:Tables<'board'>
}
interface Props {
  profileId : string;
}

function MypageChannel({profileId}:Props) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [swiper, setSwiper] = useState<SwiperClass>();
  const [swiperIndex, setSwiperIndex] = useState<number>(0);
  const swiperWrappedRef = useRef<HTMLElement|null>(null);


  useEffect( () => {
    const fetchChannels = async() => {
      const {data, error} = await supabase
      .from('approve_member')
      .select(`
        *,board(*)
      `)
        .match({
          'profile_id': profileId,
          'status': '1'
        });

      if(error) return console.error('팀 불러오기 실패')

      if(!data) return;
      setTeams(data);

    };
    fetchChannels();

    
  },[profileId])
  
  const handlePrev = () => {
    if(!swiper || !teams) return;
    const newIndex = swiperIndex-1 < 0 ? teams.length-1 : swiperIndex-1;
    setSwiperIndex(newIndex)
    swiper.slideTo(newIndex)
  }

  const handleNext = () => {
    if(!swiper || !teams) return;
    const newIndex = swiperIndex+1 > teams.length-1 ? 0 : swiperIndex+1;
    setSwiperIndex(newIndex)
    swiper.slideTo(newIndex)
  }

  return (
    <>
      <h2 className={S.sectionName}>참여중인 스터디</h2>
      {
        teams && teams.length !== 0 ? (
          <section className={S.teamContainer}>
            <button type="button" className={S.prevButton} onClick={handlePrev}>
              <img src="/public/icons/arrowLeft.svg" alt="피어리뷰 좌측 네비게이션" />
            </button>
            <Swiper 
              className="team"
              modules={[Navigation]}
              grabCursor
              initialSlide={0}
              spaceBetween={40}
              slidesPerView="auto"
              speed={900}
              style={{
                boxSizing : 'border-box',
              }}
              breakpoints={{
                640: {spaceBetween: 16},
                768: {spaceBetween: 20},
                1024: {spaceBetween: 24},
              }}
              onSwiper={(e) => {
                swiperWrappedRef.current = e.wrapperEl;
                setSwiper(e);
              }}
              onSlideChange={(swiper)=>{
                setSwiperIndex(swiper.realIndex);
              }}
            >

              {
                teams.map(({ board_id, board }, index) => 
                {
                  if(!board) return 
                  return (
                    <SwiperSlide
                      key={board_id}
                      className={`team ${
                        swiperIndex === index ? "teamActive" : ""
                      }`}
                    >
                      <Link to={`/channel/${board_id}`}>
                        <div
                          className={S.teamCard}
                          title={`${board.title} 페이지로 이동하기`}
                        >
                          <img
                            className={S.teamImg}
                            src={
                              board.images
                                ? board.images
                                : "/images/online.png"
                            }
                            alt="채널"
                          />
                          <div className={S.teamTitle}>{board.title}</div>
                        </div>
                      </Link>
                    </SwiperSlide>
                  )
          
                   }
                
                )
              }
            </Swiper>
            <button type="button" className={S.nextButton} onClick={handleNext}>
              <img src="/public/icons/arrowRight.svg" alt="피어리뷰 우측 네비게이션" />
            </button>
          </section>    
        ) : (
          <div className={S.nothing}>
            <img src="/images/emptyContents.png" alt="참여중인 스터디 없음" />
            <p>
              아직 가입된 곳이 없습니다<br />
              스터디, 프로젝트에 가입해보세요!<br />
              
            </p>
          </div>
        )
      }
    </>
  )
}
export default MypageChannel