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
type PeerReviewsList = { writer_id: string; writerProfileImage:string; review_contents:string; review_score:number; review_contents_preview:string };

/**
 * 현재 접속한 유저랑, 조회한 마이페이지 유저 params랑 같은지() 비교
 * 아이디로 비교하면 위험할거 같으니까,, 그 아이디 기준으로 nickname이 같은지 비교?
 * 
 * user_base의 nickname을 param으로 전달하고
 * 그것과 현재 접속한 userId가 일치하면
 * user_profile에서 그 아이디의 profile_id를 뽑아서
 * peer_review에서 profile_id가 일치하는 데이터 반환
 * 
 * param으로 받은 profileId와 현재접속한 유저 id -> profile_id 비교
 */

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
      const {data} = await supabase.from('peer_review').select('*').eq('profile_id',profileId);
      if(!data) return console.error('피어리뷰 불러오기 실패');
      setRawPeerReviews(data);
    }
    fetchPeerReviews();
    console.log('피어리뷰 패치 완료')
  },[profileId])


  
  useEffect(()=>{
    const refinedPeerReviews = async() => {
      if(!rawPeerReviews) return;
      const data = await Promise.all(rawPeerReviews.map(async(raw)=> {
        const {writer_id, review_contents, review_score, review_contents_preview} = raw;
        const writerData = await compareUserId(writer_id,'user_profile');
        const writerProfileImage = writerData?.[0].profile_images!
        return {writer_id, writerProfileImage, review_contents, review_score, review_contents_preview};    
      }))

      setPeerReviews(data);
    }
    refinedPeerReviews();
  },[rawPeerReviews])




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
    if(!swiper) return;
    swiper.slidePrev()
  }

  const handleNext = () => {
    if(!swiper) return;
    swiper.slideNext()
  }



  return (
      <>
      <h2 className={S.sectionName}>피어리뷰</h2>
      <section className={S.peerReviewContainer}>
        <button type="button" className={S.prevButton} onClick={handlePrev}>
          <img src="/src/assets/arrowLeft.svg" alt="피어리뷰 좌측 네비게이션" />
        </button>
        <Swiper 
          className="peerReview"
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
                  <img className={S.peerReviewWriterImg} src={writerProfileImage} alt="피어리뷰 작성자 프로필" />
                  <p className={S.review_score}>{review_score}</p>
                  <p className={S.peerReviewContent}>
                    {
                      index === swiperIndex ? review_contents : review_contents_preview
                    }
                  </p>
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
export default MypagePeerReview