import { useEffect, useRef, useState } from "react"
import type { Tables } from "src/supabase/database.types"
import compareUserId from "../../utils/compareUserId"
import S from './MypagePeerReview.module.css'

import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react"
import { Navigation } from "swiper/modules"
import './MypageSwiper.css'
import 'swiper/css'; 
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/**
 * - 피어 리뷰 보기
    - 현재 접속한 유저 id와 peer_review 테이블의 profile_id가 일치하는지 확인하고,
    - 같은걸 기준으로 데이터를 가져오는데
        - 이때 writer_id와 user_profile에 profile_id가 일치하는지 확인하고 작성한 유저의 profile_images 가져오기
        - reivew_contents, review_score 가져오기

      active가 되면 글 전체 내용 보여주기
      active가 아닐때는 10글자 내로만 보여주기
      리뷰 길이가 10자 이상시 truncate 되도록하는 함수 
      swiper-slide-acitve 인지에 따라 리뷰 컨텐츠가 줄임표나 전체 리뷰가 보여야함
 */

type PeerReview = Tables<'peer_review'>
type PeerReviewsList = { writer_id: string; writerProfileImage:string; review_contents:string; review_score:number; review_contents_preview:string };


function MypagePeerReview() {
  const [peerReviews, setPeerReviews] = useState<PeerReviewsList[]|null>(null)
  const [swiper, setSwiper] = useState<SwiperClass>();
  const [swiperIndex, setSwiperIndex] = useState<number>(0);
  const swiperWrappedRef = useRef<HTMLElement|null>(null);



  useEffect(()=>{
    const fetchPeerReviews = async() => {
      // 현재 유저의 peer reviews 리스트 불러오기
      const currentUserPeerReviews:PeerReview[]|null = await compareUserId('11e880fd-65ca-4778-b8e9-1888c1e65233','peer_review');

      // 불러온 peer reviews 들의 작성자 프로필 이미지 불러와서
      // 화면에 렌더링 시킬 데이터만 재구성해서 내보내기
      const result = await Promise.all(currentUserPeerReviews!.map(async(peerReview)=> {
        const {writer_id, review_contents, review_score, review_contents_preview} = peerReview;
        const writerData = await compareUserId(writer_id,'user_profile');
        const writerProfileImage = writerData?.[0].profile_images!
        return {writer_id, writerProfileImage, review_contents, review_score, review_contents_preview};    
      }))

      setPeerReviews(result);

    }
    fetchPeerReviews();
    console.log('피어리뷰 패치 완료')
  },[])


  // swiper 화면 크기에 따른 여백 조절
  const adjustMargin = () => {
    const screenWidth = window.innerWidth;

    if(swiperWrappedRef.current){
      swiperWrappedRef.current.style.marginLeft =
      screenWidth <= 640 ? "0px" :
      screenWidth <= 768 ? "-100px" :
      screenWidth <= 1024 ? "-180px" : "-200px";
    }
  }

  useEffect(()=>{
    adjustMargin();
    window.addEventListener("resize", adjustMargin);
    return () => window.removeEventListener("resize", adjustMargin);
  }, []);


  // 네비게이션 swiper 외부로 빼기 위한 함수
  const handlePrev = () => {
    swiper?.slidePrev()
  }

  const handleNext = () => {
    swiper?.slideNext()
  }

  return (
      <>
      <p className={S.sectionName}>피어리뷰</p>
      <div className={S.peerReviewContainer}>
        <button type="button" className={S.prevButton} onClick={handlePrev}>
          <svg  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.20723 12.0002L17.8542 1.35423C18.0492 1.15923 18.0492 0.842227 17.8542 0.647227C17.6592 0.452227 17.3422 0.452227 17.1472 0.647227L6.14723 11.6472C5.95223 11.8422 5.95223 12.1592 6.14723 12.3542L17.1472 23.3542C17.2452 23.4522 17.3732 23.5002 17.5012 23.5002C17.6292 23.5002 17.7572 23.4512 17.8552 23.3542C18.0502 23.1592 18.0502 22.8422 17.8552 22.6472L7.20723 12.0002Z" fill="black"/>
          </svg>
        </button>
        <Swiper 
          modules={[Navigation]}
          grabCursor
          initialSlide={0}
          centeredSlides = {true}
          slidesPerView="auto"
          speed={900}
          slideToClickedSlide
          spaceBetween={40}
          breakpoints={{
            640: {spaceBetween: 20},
            768: {spaceBetween: 30},
            1024: {spaceBetween: 40},
          }}
          onSwiper={(e) => {
            swiperWrappedRef.current = e.wrapperEl;
            setSwiper(e);
          }}
          onSlideChange={()=>{
            setSwiperIndex(swiper!.realIndex);
          }}
        >
          {
            peerReviews && peerReviews.map(({writer_id, writerProfileImage, review_contents, review_score, review_contents_preview},index)=>(
              <SwiperSlide key={writer_id} className="peerReview">
                <div className={S.peerReviewCard}>
                  <img className={S.peerReviewWriterImg} src={writerProfileImage} alt="프로필" />
                  <div className={S.review_score}>{review_score}</div>
                  <div className={S.peerReviewContent}>
                    {
                      index*1 === swiperIndex*1 ? review_contents : review_contents_preview
                    }
                  </div>
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
export default MypagePeerReview