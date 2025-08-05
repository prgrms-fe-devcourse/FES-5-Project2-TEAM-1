import S from "./card.module.css";

import { useEffect, useRef, useState } from "react";
import supabase from "@/supabase/supabase";
import { useNavigate} from "react-router-dom";
import type { Tables } from "@/supabase/database.types";
import HashTag from "../HashTag";
import gsap from "gsap";
import { useAuth } from "@/auth/AuthProvider";



type Board = Tables<"board">;
type CardProps = Board & {
  board_tag: Tables<"board_tag">[];
};

interface Props {
  card: CardProps;
}

function Card({ card }: Props) {
 
  const { contents, title, likes, board_id, board_tag} = card;
  const [tagList, setTagList] = useState<string[]>([]);

  const [cardLike, setCardLike] = useState(likes);
  const [isPressed, setIsPressed] = useState(false);
  const [isScrap, setIsScrap] = useState(false);
  const navigate = useNavigate();
  const likeBtnRef = useRef<HTMLButtonElement>(null);
  const scrapBtnRef = useRef<HTMLButtonElement>(null);
  const [member,setMember] = useState<number>(1)
  const { profileId } = useAuth();

  useEffect(() => {
    const storedLike = JSON.parse(
      localStorage.getItem(`like-${board_id}`) ?? "false"
    );
    const storedScrap = JSON.parse(
      localStorage.getItem(`scrap-${board_id}`) ?? "false"
    );
    setIsPressed(storedLike);
    setIsScrap(storedScrap);

    const tagList = board_tag
      .filter((tag) => typeof tag.hash_tag === "string")
      .map((tag) => tag.hash_tag as string);
    setTagList(tagList);
  }, [board_id]);

  useEffect(() => {
    const fetchMember = async () => {
      const { count,error } = await supabase.from('approve_member').select('*',{count:'exact'}).match({
        board_id: board_id,
        status:1,
      }) 
      if(error)console.error(error)
      if (count !== null) {
        setMember(count)
      }
    }
    fetchMember()
  }, [board_id])

  const handleScrap = async () => {
    if (scrapBtnRef.current) {
      gsap.fromTo(
        scrapBtnRef.current,
        { scale: 1 },
        { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.out" }
      );
    }
    const nextScrapState = !isScrap;
    setIsScrap(nextScrapState);
    localStorage.setItem(`scrap-${board_id}`, JSON.stringify(nextScrapState));

    const { data, error } = await supabase
      .from("scrap")
      .select("*")
      .eq("profile_id", profileId)
      .eq("board_id", board_id);

    if (data && data[0]) {
      await supabase.from("scrap").delete().eq("scrap_id", data[0].scrap_id);
    } else {
      await supabase.from("scrap").insert([
        {
          profile_id: profileId,
          board_id,
        },
      ]);
    }

    if (error) {
      console.error("데이터를 제대로 불러오지 못하였습니다");
      setIsScrap(!isScrap);
    }
  };

  const handleLike = async () => {
    if (likeBtnRef.current) {
      gsap.fromTo(
        likeBtnRef.current,
        { scale: 1 },
        { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.out" }
      );
    }
    const pressState = isPressed ? cardLike - 1 : cardLike + 1;
    const nextState = !isPressed;

    setCardLike(pressState);
    setIsPressed(!isPressed);
    localStorage.setItem(`like-${board_id}`, JSON.stringify(nextState));
    const { error } = await supabase
      .from("board")
      .update({ likes: pressState })
      .eq("board_id", board_id);

    if (error) {
      console.error("좋아요 업데이트 실패", error.message);
      setCardLike(isPressed ? cardLike - 1 : cardLike + 1);
      setIsPressed(!isPressed);
      localStorage.setItem(`like-${board_id}`, JSON.stringify(nextState));
    }
  };

  const handleRoute = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    card: CardProps
  ) => {
    e.preventDefault();
    if (
      !(e.target as HTMLButtonElement).closest("img") ||
      !(e.target as HTMLButtonElement).closest("button")
    ) {
      navigate(`/channel/${board_id}`, { state: { card } });
    } else {
      return;
    }
  };

  const replaceText = contents.replace(/[#*]/g, "");

  return (
    <section className={S.container} onClick={(e) => handleRoute(e, card)}>
      <div className={S.cardTop}>
        <h4>{title}</h4>
        <div className={S.cardTopRight}>
          <button
            className={S.scrapBtn}
            onClick={handleScrap}
            ref={scrapBtnRef}
          >
            {isScrap ? (
              <img src="/icons/scraplittleActive.png" alt="스크랩 활성화" />
            ) : (
              <img src="/icons/scraplittle.svg" alt="스크랩 비 활성화" />
            )}
          </button>
          <button className={S.likeBtn} onClick={handleLike} ref={likeBtnRef}>
            {isPressed ? (
              <img src="/icons/likeActive.png" alt="" />
            ) : (
              <img src="/icons/like.svg" alt="" />
            )}
            {cardLike}
          </button>
        </div>
      </div>
      <div className={S.titleBox}>
        <p>{replaceText}</p>
      </div>
      <div className={S.tagBox}>
        <div className={S.members}>
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

        {tagList && (
          <HashTag taglist={tagList} defaultList={tagList} editable={false} />
        )}
      </div>
    </section>
  );
}
export default Card;
