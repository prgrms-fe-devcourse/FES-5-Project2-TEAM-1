import { useEffect, useRef, useState } from "react"
import type { Tables } from "src/supabase/database.types"
import compareUserId from "../../utils/compareUserId"
import S from './MypagePeerReview.module.css'

import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react"
import { Pagination, Navigation } from "swiper/modules"

import './MypagePeerReview.css'
import 'swiper/css'; 
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/**
 * - 피어 리뷰 보기
    - 현재 접속한 유저 id와 peer_review 테이블의 profile_id가 일치하는지 확인하고,
    - 같은걸 기준으로 데이터를 가져오는데
        - 이때 writer_id와 user_profile에 profile_id가 일치하는지 확인하고 작성한 유저의 profile_images 가져오기
        - reivew_contents, review_score 가져오기
 */

type PeerReview = Tables<'peer_review'>
type PeerReviewsList = { writer_id: string; writerProfileImage:string; review_contents:string; review_score:number};


const dumpData = [
  {
    writerProfileImage : 'https://w7.pngwing.com/pngs/246/406/png-transparent-animal-crossing-molly-games-animal-crossing.png', 
    review_contents : 'review_contents test', 
    review_score: '4.5',
  },
  {
    writerProfileImage : 'https://w7.pngwing.com/pngs/246/406/png-transparent-animal-crossing-molly-games-animal-crossing.png', 
    review_contents : 'review_contents test review_contents test review_contents testreview_contents test', 
    review_score: '4.7',
  },
  {
    writerProfileImage : 'https://w7.pngwing.com/pngs/246/406/png-transparent-animal-crossing-molly-games-animal-crossing.png', 
    review_contents : 'review_contents test', 
    review_score: '3.8',
  },
  {
    writerProfileImage : 'https://w7.pngwing.com/pngs/246/406/png-transparent-animal-crossing-molly-games-animal-crossing.png', 
    review_contents : 'review_contents test review_contents testreview_contents testreview_contents testreview_contents test', 
    review_score: '4.5',
  },
  {
    writerProfileImage : 'https://w7.pngwing.com/pngs/246/406/png-transparent-animal-crossing-molly-games-animal-crossing.png', 
    review_contents : 'review_contents test', 
    review_score: '4.0',
  },
]



function MypagePeerReview() {
  const [peerReviews, setPeerReviews] = useState<PeerReview[]|null>(null)
  const [swiper, setSwiper] = useState<SwiperClass>();
  const swiperWrappedRef = useRef<HTMLElement|null>(null);


  useEffect(()=>{
    const fetchPeerReviews = async() => {
      const result = await compareUserId('test1','peer_review');
      setPeerReviews(result);
    }
    fetchPeerReviews();
  },[])
  console.log('리뷰 불러오기',peerReviews);

  // const peerReviewsList:PeerReviewsList[] = peerReviews!.map((peerReview)=>{
  //   const {writer_id, review_contents, review_score} = peerReview;

  //   let writerProfileImage;
  //   const fetchWriterProfile = async()=>{
  //     const result = await compareUserId(writer_id,'user_profile');
  //     if(!result) return;
  //     // console.log('writer profile: ', result[0].profile_images);
  //     writerProfileImage=result[0].profile_images;
  //     return {writer_id, writerProfileImage, review_contents, review_score};
  //   }
  //   return fetchWriterProfile();
  // })

  // console.log(peerReviewsList);


  const adjustMargin = () => {
    const screenWidth = window.innerWidth;

    if(swiperWrappedRef.current){
      swiperWrappedRef.current.style.marginLeft =
      screenWidth <= 520 ? "0px" :
      screenWidth <= 650 ? "-50px" :
      screenWidth <= 800 ? "-100px" : "-150px";
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


  // 리뷰 길이가 10자 이상시 truncate 되도록하는 함수 
  // slide-acitve 인지에 따라 리뷰 컨텐츠가 줄임표나 전체 리뷰가 보여야함


  return (
      <>
      <p className={S.sectionName}>피어리뷰</p>
      <div className={S.peerReviewContainer}>
        <svg className={S.prevButton} onClick={handlePrev} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.20723 12.0002L17.8542 1.35423C18.0492 1.15923 18.0492 0.842227 17.8542 0.647227C17.6592 0.452227 17.3422 0.452227 17.1472 0.647227L6.14723 11.6472C5.95223 11.8422 5.95223 12.1592 6.14723 12.3542L17.1472 23.3542C17.2452 23.4522 17.3732 23.5002 17.5012 23.5002C17.6292 23.5002 17.7572 23.4512 17.8552 23.3542C18.0502 23.1592 18.0502 22.8422 17.8552 22.6472L7.20723 12.0002Z" fill="black"/>
        </svg>
        <Swiper 
          modules={[Navigation]}
          grabCursor
          initialSlide={2}
          centeredSlides
          slidesPerView="auto"
          speed={800}
          slideToClickedSlide
          breakpoints={{
            320: {spaceBetween: 40},
            650: {spaceBetween: 30},
            1000: {spaceBetween: 20},
          }}
          onSwiper={(e) => {
            swiperWrappedRef.current = e.wrapperEl;
            setSwiper(e);
          }}
        >
          {
            dumpData.map((dump, index)=>(
              <SwiperSlide key={index}>
                <div className={S.peerReviewCard}>
                  <img className={S.peerReviewWriterImg} src={dump.writerProfileImage} alt="프로필" />
                  <div className={S.review_score}>{dump.review_score}</div>
                  <div className={S.peerReviewContent}>
                    {
                      dump.review_contents.length>10 ? dump.review_contents.slice(0,10) : dump.review_contents
                    }
                  </div>
                </div>
              </SwiperSlide>
            ))
          }
        </Swiper>
        <svg className={S.nextButton} onClick={handleNext} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.8538 11.6458L6.85376 0.645762C6.65876 0.450762 6.34176 0.450762 6.14676 0.645762C5.95176 0.840762 5.95176 1.15776 6.14676 1.35276L16.7928 11.9998L6.14576 22.6458C5.95076 22.8408 5.95076 23.1578 6.14576 23.3528C6.24376 23.4508 6.37176 23.4998 6.49976 23.4998C6.62776 23.4998 6.75576 23.4508 6.85376 23.3538L17.8538 12.3538C18.0488 12.1578 18.0488 11.8418 17.8538 11.6458Z" fill="black"/>
        </svg>
      </div>
    </>
    




    
  )
}
export default MypagePeerReview