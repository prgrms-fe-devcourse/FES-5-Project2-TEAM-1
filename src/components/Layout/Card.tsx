import S from "./card.module.css";

import { useEffect, useRef, useState } from "react";
import supabase from "@/supabase/supabase";
import { useNavigate } from "react-router-dom";
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
  const { contents, title, likes, board_id, board_tag } = card;
  const [tagList, setTagList] = useState<string[]>([]);

  const [cardLike, setCardLike] = useState(likes);
  const [isPressed, setIsPressed] = useState(false);
  const [isScrap, setIsScrap] = useState(false);
  const navigate = useNavigate();
  const likeBtnRef = useRef<HTMLButtonElement>(null);
  const scrapBtnRef = useRef<HTMLButtonElement>(null);

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
        {tagList && (
          <HashTag taglist={tagList} defaultList={tagList} editable={false} />
        )}
      </div>
    </section>
  );
}
export default Card;
