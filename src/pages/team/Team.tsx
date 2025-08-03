import S from './Team.module.css'
import { useEffect, useState } from "react";
import supabase from "@/supabase/supabase";
import { useAuth } from "@/auth/AuthProvider";
import type { Tables } from "@/supabase/database.types";
import { useNavigate } from 'react-router-dom';
import { DdayCounter } from '../Study/components/utills/DdayCounter';

type Board = Tables<"board"> & {
  user_profile: Tables<"user_profile"> & {
    user_base:Tables<'user_base'>
  }
};

function TeamPage() {
  const navigate = useNavigate()
  const { profileId } = useAuth();
  const [myTeams, setMyTeams] = useState<Board[] | null>([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data, error } = await supabase
        .from("approve_member")
        .select("*, user_profile(*,user_base(*))")
        .match({
          "profile_id": profileId,
          'status': 1
        })

      if (error) {
        console.error(error.message);
        return;
      }
      setMyTeams(data);
    };

    if (profileId) fetchTeams();
  }, [profileId]);


  return (
    <div className={S.container}>
      <h2>My Teams</h2>
      <ul className={S.teamList}>
        {myTeams && myTeams.length > 0 ? (
          myTeams.map((team) => {
            const dDay = DdayCounter(team.deadline ?? "");
            return (
              <li className={S.teamWrap} key={team.board_id}>
                <div className={S.teaminfoWrap}>
                  {
                    <img
                      src={team.images ?? "/images/애플.png"}
                      alt="팀 썸네일 이미지"
                    />
                  }
                  <div className={S.teaminfo}>
                    <p>
                      {team.board_cls == null
                        ? "준비중"
                        : team.board_cls == "0"
                        ? "스터다"
                        : "프로젝트"}
                    </p>
                    <h3>{team.title}</h3>
                  </div>
                </div>
                <div className={S.deadline}>
                  {team.deadline == null ? (
                    <p>진행중인 프로젝트가 없습니다</p>
                  ) : new Date(team.deadline).getTime() <= Date.now() ? (
                    <button
                      type="button"
                      className={S.peerReviewBtn}
                      onClick={() => navigate(`/channel/${team.board_id}`)}
                    >
                      피어리뷰 작성하기
                    </button>
                  ) : (
                    <div>
                      남은기한 : {dDay[0]}
                      {dDay[1]} 일
                    </div>
                  )}
                  <button
                    type="button"
                    className={S.moveBtn}
                    onClick={() => navigate(`/channel/${team.board_id}`)}
                  >
                    채널이동하기
                  </button>
                </div>
              </li>
            );
          })
        ) : (
          <div className={S.MyTeam}>
            <img src="/images/팬타.webp" alt="" />
            <div className={S.message}>
              현재 참여중인 팀이 없습니다
            
            </div>
          </div>
        )}
      </ul>
    </div>
  );
}

export default TeamPage;
