import { useEffect, useRef, useState } from "react"
import type { Tables } from "src/supabase/database.types"
import compareUserId from "../../../utils/compareUserId"
import S from './MypagePeerReview.module.css'

import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react"
import { Navigation } from "swiper/modules"
import './MypageSwiper.css'
import 'swiper/css'; 
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import supabase from "@/supabase/supabase"

type PeerReview = Tables<'peer_review'>
type PeerReviewsList = { 
  review_id: string;
  writer_id: string; 
  writerProfileImage:string; 
  review_contents:string; 
  review_score:number; 
};

interface Props {
  profileId : string;
}
function MypagePeerReview({profileId}:Props) {
  const [rawPeerReviews, setRawPeerReviews] = useState<PeerReview[]|null>(null)
  const [peerReviews, setPeerReviews] = useState<PeerReviewsList[]|null>(null);
  const [swiper, setSwiper] = useState<SwiperClass>();
  const [swiperIndex, setSwiperIndex] = useState<number>(0);
  const swiperWrappedRef = useRef<HTMLElement|null>(null);

  useEffect(()=>{
    if(!profileId) return;
    const fetchPeerReviews = async() => {
      const {data, error} = await supabase.from('peer_review').select('*').eq('profile_id',profileId);
      if(error) return console.error('피어리뷰 불러오기 실패');
      setRawPeerReviews(data);
    }
    fetchPeerReviews();
  },[profileId])


  
  useEffect(()=>{
    const refinedPeerReviews = async() => {
      if(!rawPeerReviews) return;
      const data = await Promise.all(rawPeerReviews.map(async(raw)=> {
        const {review_id, writer_id, review_contents, review_score} = raw;
        const writerData = await compareUserId(writer_id,'user_profile');
        const writerProfileImage = writerData?.[0].profile_images!
        return {review_id, writer_id, writerProfileImage, review_contents, review_score};    
      }))
      setPeerReviews(data);
    }
    refinedPeerReviews();
  },[rawPeerReviews])


  // 네비게이션 swiper 외부로 빼기 위한 함수
  const handlePrev = () => {
    if(!swiper || !peerReviews) return;
    const newIndex = swiperIndex-1 < 0 ? peerReviews?.length-1 : swiperIndex-1;
    setSwiperIndex(newIndex)
    swiper.slideTo(newIndex)
  }

  const handleNext = () => {
    if(!swiper || !peerReviews) return;
    const newIndex = swiperIndex+1 > peerReviews.length-1 ? 0 : swiperIndex+1;
    setSwiperIndex(newIndex)
    swiper.slideTo(newIndex)
  }



  return (
      <>
      <h2 className={S.sectionName}>피어리뷰</h2>
      {
        peerReviews && peerReviews.length !== 0 ? (
          <section className={S.peerReviewContainer}>
            <button type="button" className={S.prevButton} onClick={handlePrev}>
              <img src="/public/icons/arrowLeft.svg" alt="피어리뷰 좌측 네비게이션" />
            </button>
            <Swiper 
              className="peerReview"
              modules={[Navigation]}
              grabCursor
              initialSlide={0}
              slidesPerView="auto"
              speed={900}
              slideToClickedSlide = {true}
              spaceBetween={40}
              // watchSlidesProgress={true}
              // updateOnWindowResize={true}
              // resizeObserver={true}
              // simulateTouch={true}
              style={{
                padding: "0",
                boxSizing: "border-box"
              }}
              breakpoints={{
                640: {spaceBetween: 16},
                768: {spaceBetween: 24},
                1024: {spaceBetween: 32},
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
                peerReviews.map(({review_id,writer_id, writerProfileImage, review_contents, review_score},index)=>(
                  <SwiperSlide 
                    key={review_id} 
                    onClick={()=>{
                      swiper?.slideTo(index);
                      setSwiperIndex(index);
                    }}
                    className={`peerReview ${swiperIndex === index ? 'peerReviewActive' : ''}`}>
                      <div className={S.peerReviewCard}>
                        <img className={S.peerReviewWriterImg} src={writerProfileImage} alt="피어리뷰 작성자 프로필" />
                        <p className={S.review_score}>{review_score}</p>
                        <div className={ index === swiperIndex ? S.peerReviewContent : S.peerReviewContentPreview}>
                            {review_contents}
                        </div>
                      </div>
                  </SwiperSlide>
                ))
              }
            </Swiper>
            <button type="button" className={S.nextButton} onClick={handleNext}>
              <img src="/public/icons/arrowRight.svg" alt="피어리뷰 우측 네비게이션" />
            </button>
          </section>
        ) : (
          <div className={S.nothing}>
            <img src="/images/emptyContents.png" alt="피어리뷰 없음" />
            <p>
              아직 피어리뷰가 없습니다 <br />
              스터디, 프로젝트에 가입하여 피어리뷰를 작성해보세요!<br />
              
            </p>
          </div>
        )
      }
    </>
    
  )
}
export default MypagePeerReview