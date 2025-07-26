import { useLocation } from "react-router-dom";
import S from "./StudyJoinInfomation.module.css";
import type { Tables } from "@/supabase/database.types";
import Project from "./components/Project";
import ChannelComment from "./components/ChannelComment";

function StudyJoinInfomation() {
  const location = useLocation();
  const card = location.state.card;

  if (!card) throw new Error("데이터가 들어오지 않습니다");
  const { images, title, address, member, board_tag, contents } = card;

  return (
    <main className={S.container}>
      <div className={S.layout}>
        <div className={S.channelInfoBox}>
          <img src={images} alt="스터디 이미지" />
          <div className={S.textInfo}>
            <div className={S.title}>
              <h2>{title}</h2>
            </div>
            <div className={S.tagBox}>
              {(board_tag as Tables<"board_tag">[]).map((t) => (
                <div key={t.tag_id}>{t.hash_tag}</div>
              ))}
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
              {address}
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
            </div>
          </div>
        </div>
        <article className={S.content}>{contents}</article>
        <section>
          <div className={S.project}>
            <h4>프로젝트안내</h4>
            <button type="button">프로젝트 생성</button>
          </div>
          <Project />
        </section>
        <section>
          <ChannelComment />
        </section>
      </div>
    </main>
  );
}

export default StudyJoinInfomation;
