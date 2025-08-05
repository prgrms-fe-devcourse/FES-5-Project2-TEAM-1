import { createPortal } from 'react-dom';
import S from './PeerReviewPopup.module.css';
import type { User } from '@/pages/Mypage/Mypage';
import { useEffect, useRef, useState } from 'react';
import supabase from '@/supabase/supabase';
import gsap from 'gsap';



interface Props {
    user: User;
    onClose: () => void;
}


function PeerReviewPopup({ user, onClose }: Props) {

    const [averageScore, setAverageScore] = useState(0);
    const container = document.getElementById('standard-container');
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {

        const fetchPeer = async () => {
            const {count, data, error} = await supabase
                .from('peer_review')
                .select('review_score', { count: 'exact'})
                .match ({
                    profile_id: user.profile[0].profile_id
                })

            if( error ) {
                console.error('피어리뷰 불러오기 실패');
                return;
            }

            let total = 0;
            data.map(score => {
                total += Number(score.review_score);
            })
            
            const average = count ? (total / count) : 0;
            const percent = Math.round((average / 5) * 100); // 온도계용 퍼센트
            setAverageScore(percent);
        }

        fetchPeer();
    }, []);

  useEffect(() => {
    if (popupRef.current) {
      gsap.fromTo(
        popupRef.current,
        { opacity: 0, y: -40 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, []);

    if( !container ) return null;

    const getColor = (score: number) => {
    if (score >= 80) return '#2ecc71'; // 초록
    if (score >= 60) return '#f1c40f'; // 노랑
    if (score >= 40) return '#e67e22'; // 주황
    return '#e74c3c'; // 빨강
    };

  return createPortal(
    <div className={S.wrapper}>
        <div className={S.container} ref={popupRef}>
            <div className={S.header}>
                <h1>Profile</h1>
                <button onClick={onClose}>X</button>
            </div>
            <div className={S.middle}>
                <div className={S.image}>
                    <img src={user.profile[0]?.profile_images} />
                </div>
                <div className={S.details}>
                    <span>{user.nickname || '프둥이'}, </span>
                    <span>{user.profile[0]?.age || '0'}</span>
                </div>
                <div className={S.role}><span>{user.role || '프론트엔드'}</span></div>
            </div>
            <div className={S.score}>
                <div className={S.thermometer}>
                    <div
                    className={S.thermoFill}
                    style={{ height: `${averageScore}%`, backgroundColor: getColor(averageScore) }}
                    ></div>
                </div>
                <div className={S.scoreText}>
                    <span>{(averageScore / 20).toFixed(1)}°</span>
                    <span>피어온도</span>
                </div>
            </div>
        </div>
    </div>,
    container
  )
}

export default PeerReviewPopup
