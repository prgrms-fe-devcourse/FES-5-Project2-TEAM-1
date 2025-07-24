import { useEffect, useRef, useState } from "react";
import type { Tables } from "src/supabase/database.types"
import compareUserId from "../../utils/compareUserId";
import S from './MypageChannel.module.css'

import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react"
import { Navigation } from "swiper/modules"
import './MypageSwiper.css'
import 'swiper/css'; 
import 'swiper/css/pagination';
import 'swiper/css/navigation';
/**
 * - 참여중 스터디 확인
    - 현재 접속한 유저 id와 channel 테이블의 profile_id가 같은게 있는지 확인하고,
    - 같은걸 기준으로 채널의 ttile과 channel_images 가져와서 카드로 뿌리기

  - 채널 링크 생성되면 채널 카드 클릭시 해당 채널 페이지로 이동하게 연결하기
  - 유저 별로 다른 데이터 불러와지도록 연결하기
 */

type Channel = Tables<'channel'>;

function MypageChannel() {
  const [channels, setChannels] = useState<Channel[]|null>(null);
  const [swiper, setSwiper] = useState<SwiperClass>();
  const swiperWrappedRef = useRef<HTMLElement|null>(null);


  useEffect( () => {
    const fetchChannels = async() => {
      const result = await compareUserId('11e880fd-65ca-4778-b8e9-1888c1e65233','channel')
      setChannels(result);
    };
    fetchChannels();
    console.log('가입 채널 패치 완료');
  },[])

  console.log('가입된 채널',channels);

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
    swiper?.slidePrev()
  }

  const handleNext = () => {
    swiper?.slideNext()
  }

  return (
    <>
      <p className={S.sectionName}>참여중인 스터디</p>
      <div className={S.channelContainer}>
        <button type="button" className={S.prevButton} onClick={handlePrev}>
          <svg  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.20723 12.0002L17.8542 1.35423C18.0492 1.15923 18.0492 0.842227 17.8542 0.647227C17.6592 0.452227 17.3422 0.452227 17.1472 0.647227L6.14723 11.6472C5.95223 11.8422 5.95223 12.1592 6.14723 12.3542L17.1472 23.3542C17.2452 23.4522 17.3732 23.5002 17.5012 23.5002C17.6292 23.5002 17.7572 23.4512 17.8552 23.3542C18.0502 23.1592 18.0502 22.8422 17.8552 22.6472L7.20723 12.0002Z" fill="black"/>
          </svg>
        </button>
        <Swiper 
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
            channels && channels.map(({channel_id, channel_images, title})=>(
              <SwiperSlide key={channel_id} className="channel">
                <div className={S.channelCard}>
                  <img className={S.channelImg} src={channel_images ? channel_images : 'defaultBackground.img'} alt="채널" />
                  <p className={S.channelTitle}>{title}</p>
                </div>
              </SwiperSlide>
            ))
          }
        </Swiper>
        <button type="button" className={S.nextButton} onClick={handleNext}>
          <svg  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.8538 11.6458L6.85376 0.645762C6.65876 0.450762 6.34176 0.450762 6.14676 0.645762C5.95176 0.840762 5.95176 1.15776 6.14676 1.35276L16.7928 11.9998L6.14576 22.6458C5.95076 22.8408 5.95076 23.1578 6.14576 23.3528C6.24376 23.4508 6.37176 23.4998 6.49976 23.4998C6.62776 23.4998 6.75576 23.4508 6.85376 23.3538L17.8538 12.3538C18.0488 12.1578 18.0488 11.8418 17.8538 11.6458Z" fill="black"/>
          </svg>
        </button>
      </div>
    </>
  )
}
export default MypageChannel