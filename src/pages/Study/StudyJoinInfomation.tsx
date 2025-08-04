import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import S from "./StudyJoinInfomation.module.css";
import type { Tables } from "@/supabase/database.types";
import Project from "./components/Project";
import ChannelComment from "./components/ChannelComment";
import { useEffect, useState } from "react";
import supabase from "@/supabase/supabase";
import MarkDownConvert from "@/components/MarkDownConvert";
import { useAdmin } from "./context/useAdmin";
import { chooseRegion } from "@/utils/chooseRegion";
import HashTag from "@/components/HashTag";
import { useAuth } from "@/auth/AuthProvider";

type Board = Tables<"board">;
type CardProps = Board & {
  board_tag: Tables<"board_tag">[];
};

function StudyJoinInfomation() {
  const {profileId} = useAuth();
  const { isAdmin } = useAdmin();
  const { id } = useParams();
  const [card, setCard] = useState<CardProps | null>(null);
  const [tagList, setTagList] = useState<string[]>([]);
  const [isFinish, setIsFinish] = useState(false);
  const [isMember, setIsMember] = useState<boolean|null>(null);
  const [isSubmit,setIsSubmit] = useState(false)
  const navigate = useNavigate();


  
  useEffect(() => {
    if (!id) throw new Error("id가없습니다");
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("board")
        .select("*,board_tag(*)")
        .eq("board_id", id)
        .single();
      if (error) throw new Error("데이터가 들어오지않아요");
      setCard(data as CardProps);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const checkIsMember = async () => {
      if (!id || !profileId) return;

      const { data, error } = await supabase
        .from("approve_member")
        .select("status")
        .match({
          board_id: id,
          profile_id: profileId,
          status:'1',
        })
        .maybeSingle();
      if (error) {
        console.error(error);
        return;
      }
     if (data?.status === "1" || isAdmin) {
       setIsMember(true);
     } else {
       setIsMember(false);
     }
    };

    checkIsMember();
  }, [id, profileId,isAdmin]);

  useEffect(() => {
    if (!card) return;
    if (card.board_tag) {
      const tagList = card.board_tag
        .filter((tag) => typeof tag.hash_tag === "string")
        .map((tag) => tag.hash_tag as string);
      setTagList(tagList);
    }
  }, [card?.board_tag]);

  useEffect(() => {
    const finishProject = async () => {
      const { data } = await supabase
        .from("board")
        .select("deadline")
        .eq("board_id", id)
        .single();

      if (!data) return;
      const deadLine = new Date(data.deadline).getTime();
      if (deadLine <= Date.now()) {
        setIsFinish(true);
      }
    };
    finishProject();
  }, [id]);

    useEffect(() => {
      const fetchSubmit = async () => {
        const { data, error } = await supabase.from("peer_review").select("review_id").match({
          board_id: id,
          writer_id: profileId,
        });
        if (error) console.error(error);
        if(!data) return 
        setIsSubmit(data.length > 0);
      };
      fetchSubmit();
    }, [id, profileId]);
  
    if (!card) return;
    const { images, title, address, member, contents, board_id, board_cls} =
      card;

  return (
    <main className={S.container}>
      <div className={S.layout}>
        <div className={S.channelInfoBox}>
          {images && <img src={images} alt="스터디 이미지" />}
          <div className={S.textInfo}>
            <div className={S.title}>
              <div className={S.titleTop}>
                <h2>{title}</h2>
                {isAdmin && (
                  <NavLink to={`/write/${board_id}`}>
                    <button type="button" className={S.setting}>
                      <img src="/icons/edit.svg" alt="" />
                    </button>
                  </NavLink>
                )}
              </div>
            </div>
            <div className={S.tagBox}>
              <span>
                <svg
                  width="12"
                  height="14"
                  viewBox="0 0 12 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="5.87206"
                    cy="4.18212"
                    r="2.81395"
                    fill="#555555"
                    fillOpacity="0.5"
                  />
                  <path
                    d="M0.244141 9.74024C0.244141 8.63567 1.13957 7.74023 2.24414 7.74023H9.49995C10.6045 7.74023 11.4999 8.63566 11.4999 9.74023V13.3681H0.244141V9.74024Z"
                    fill="#555555"
                    fillOpacity="0.5"
                  />
                </svg>
              </span>
              {member}
              {address && (
                <>
                  <span>
                    <svg
                      width="3"
                      height="3"
                      viewBox="0 0 3 3"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.50935 2.55176C0.948598 2.55176 0.5 2.10316 0.5 1.5611C0.5 1.00036 0.948598 0.551758 1.50935 0.551758C2.0514 0.551758 2.5 1.00036 2.5 1.5611C2.5 2.10316 2.0514 2.55176 1.50935 2.55176Z"
                        fill="#555555"
                        fillOpacity="0.7"
                      />
                    </svg>
                  </span>{" "}
                  {chooseRegion(address)}
                  <span>
                    <svg
                      width="3"
                      height="3"
                      viewBox="0 0 3 3"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.50935 2.55176C0.948598 2.55176 0.5 2.10316 0.5 1.5611C0.5 1.00036 0.948598 0.551758 1.50935 0.551758C2.0514 0.551758 2.5 1.00036 2.5 1.5611C2.5 2.10316 2.0514 2.55176 1.50935 2.55176Z"
                        fill="#555555"
                        fillOpacity="0.7"
                      />
                    </svg>
                  </span>
                </>
              )}
              {tagList && (
                <HashTag
                  taglist={tagList}
                  defaultList={tagList}
                  editable={false}
                />
              )}
            </div>
          </div>
        </div>
        <MarkDownConvert markdown={contents} addClass={S.contents} />
        <section>
          <div className={S.project}>
            <h4>프로젝트안내</h4>
            {isAdmin && (
              <Link to="management">
                <button type="button">프로젝트 생성</button>
              </Link>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <Project />
            {board_cls === "1" && isFinish && (
              <div className={S.overlay}>
                {isMember ? (
                  isSubmit ? (
                    <p>피어리뷰를 제출하셨습니다</p>
                  ) : (
                    <button
                      type="button"
                      className={S.peerReviewBtn}
                      onClick={() =>
                        navigate(`/channel/${id}/peerReview/${id}`)
                      }
                    >
                      피어리뷰 작성하기
                    </button>
                  )
                ) : (
                  <p>프로젝트가 종료되었습니다</p>
                )}
              </div>
            )}
          </div>
        </section>
        <section>
          <ChannelComment {...card} />
        </section>
      </div>
    </main>
  );
}

export default StudyJoinInfomation;
