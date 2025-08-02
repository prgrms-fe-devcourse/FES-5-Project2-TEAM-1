import { useEffect, useMemo, useRef, useState } from 'react';
import S from './PeerReveiw.module.css'
import supabase from '@/supabase/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import type { Tables } from '@/supabase/database.types';
import { useToast } from '@/utils/useToast';
import { useAuth } from '@/auth/AuthProvider';


type User = Tables<"board"> & {
  user_profile: Tables<"user_profile"> & {
    user_base: Tables<"user_base">;
  };
};


function PeerReiview() {

  const navigate = useNavigate()
  const formRef = useRef<HTMLFormElement>(null)
  const {profileId} = useAuth()
  const {success} = useToast()
  const {id} = useParams()
  const [users, setUsers] = useState<User[] | null>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [reviewContent, setReviewContent] = useState('')
  const [reviewScore,setReviewScore] = useState(0)
  const targetProfileId = useMemo(() => {
    if (!users || users.length === 0) return null;
    return users[currentIndex]?.user_profile?.profile_id ?? null;
  }, [users, currentIndex]);

  useEffect(() => {
    const userData = async () => {
      const { data,error } = await supabase.from('board_member').select('*,user_profile(*,user_base(*))').eq('board_id', id)
      if (error) console.error(error.message)
      if (!data) return
      
      const filterMine = data.filter(item => item.user_profile.profile_id !== profileId)
      setUsers(filterMine)
    }  
    userData()
  }, [id, profileId])
  
  useEffect(() => {
    if(!targetProfileId) return
    const scoreData = async() => {
    const { data: scores, error } = await supabase
    .from("peer_review")
    .select("review_score")
    .eq("profile_id", targetProfileId).maybeSingle()
  
    if (error) console.error(error.message);
        if (scores) {
          setReviewScore(scores.review_score); 
        } else {
          setReviewScore(0);
        }
    }
    scoreData()
  },[targetProfileId])

  

  const next = () => {
    if (users && currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      handleSubmit()
    }
  }

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

const getAverageScore = () => {
const q1 = Number(
  (
    formRef.current?.querySelector(
      'input[name="q1"]:checked'
    ) as HTMLInputElement
  )?.value
);

const q2 = Number(
  (
    formRef.current?.querySelector(
      'input[name="q2"]:checked'
    ) as HTMLInputElement
  )?.value
);

const q3 = Number(
  (
    formRef.current?.querySelector(
      'input[name="q3"]:checked'
    ) as HTMLInputElement
  )?.value
);
  const currentAvarage = Number(((q1 + q2 + q3) / 3).toFixed(2));

  if (reviewScore > 0) {
    return Number(((reviewScore + currentAvarage) / 2).toFixed(2))
  }else{
    return currentAvarage
  }
  };
  

  const handleSubmit = async () => {
    
    const avgScore = getAverageScore()
    const contentPreview = reviewContent.length >= 20 ? reviewContent.slice(0, 19) : reviewContent
    const { error } = await supabase.from('peer_review').insert([{
      profile_id:targetProfileId,
      writer_id:profileId,
      review_contents:reviewContent,
      create_at: new Date(),
      review_score:avgScore,
      review_contents_preview:contentPreview
    }]) 
    if (error) console.error()
    await success('제출에 성공하셨습니다')
    await setTimeout(() => navigate(`/channel/${id}`),2000); 
  }
 
  return (
    <div className={S.container}>
      <h2>Peer Review</h2>
      {users && users[currentIndex] &&
        users.map((user) => {
          const profile = user.user_profile;
          const base = profile.user_base;

          return (
            <div className={S.userWrap} key={user.user_profile.profile_id}>
              <div className={S.userInfo}>
                <img src={profile.profile_images} alt="유저프로필 이미지" />
                <div className={S.username}>
                  <h4>{base.nickname}</h4>
                  <p>{base.role}</p>
                </div>
              </div>
            </div>
          );
        })}

      <form className={S.peerReviewWrap} ref={formRef}>
        <ul className={S.peerReviewForm}>
          <li className={S.peerReviewScoreWrap}>
            <p>
              이 팀원이 프로젝트에 기여한 기술적 지식이 얼마나 도움되었나요?
            </p>
            <div className={S.scoreForm}>
              <input type="radio" name="q1" id="q1-1" value="1" required />
              <label htmlFor="q1-1">매우 도움이 되지 않았음</label>
              <input type="radio" name="q1" id="q1-2" value="2" />
              <label htmlFor="q1-2">도움이 되지 않았음</label>
              <input type="radio" name="q1" id="q1-3" value="3" />
              <label htmlFor="q1-3">보통</label>
              <input type="radio" name="q1" id="q1-4" value="4" />
              <label htmlFor="q1-4">도움이 되었음</label>
              <input type="radio" name="q1" id="q1-5" value="5" />
              <label htmlFor="q1-5">매우 도움이 되었음</label>
            </div>
          </li>
          <li className={S.peerReviewScoreWrap}>
            <p>이 팀원과 의사소통이 원활하셨나요?</p>
            <div className={S.scoreForm}>
              <input type="radio" name="q2" id="q2-1" value="1" required />
              <label htmlFor="q2-1">매우 원활치 않음</label>
              <input type="radio" name="q2" id="q2-2" value="2" />
              <label htmlFor="q2-2">원활하지 않았음</label>
              <input type="radio" name="q2" id="q2-3" value="3" />
              <label htmlFor="q2-3">보통</label>
              <input type="radio" name="q2" id="q2-4" value="4" />
              <label htmlFor="q2-4">원활함</label>
              <input type="radio" name="q2" id="q2-5" value="5" />
              <label htmlFor="q2-5">매우 원할함</label>
            </div>
          </li>
          <li className={S.peerReviewScoreWrap}>
            <p>이 팀원은 프로젝트에 적극적으로 임하였나요?</p>
            <div className={S.scoreForm}>
              <input type="radio" name="q3" id="q3-1" value="1" required />
              <label htmlFor="q3-1">매우 부정적</label>
              <input type="radio" name="q3" id="q3-2" value="2" />
              <label htmlFor="q3-2">부정적</label>
              <input type="radio" name="q3" id="q3-3" value="3" />
              <label htmlFor="q3-3">보통</label>
              <input type="radio" name="q3" id="q3-4" value="4" />
              <label htmlFor="q3-4">긍정적</label>
              <input type="radio" name="q3" id="q3-5" value="5" />
              <label htmlFor="q3-5">매우 긍정적</label>
            </div>
          </li>
          <li className={S.peerReviewScoreWrap}>
            <p>
              그 외 이 팀원에 대하 추가로 남기고 싶은 말이 있다면 자유롭게
              적어주세요
            </p>
            <textarea
              placeholder="내용을 적어주세요"
              className={S.etc}
              onChange={(e) => setReviewContent(e.target.value)}
            ></textarea>
          </li>
        </ul>
      </form>
      <div className={S.btnWrap}>
        {currentIndex > 0 && (
          <button type="button" onClick={prev}>
            이전
          </button>
        )}

        <button type="button" onClick={next}>
          {users && currentIndex === users?.length - 1 ? "제촐" : "다음"}
        </button>
      </div>
    </div>
  );
}
export default PeerReiview