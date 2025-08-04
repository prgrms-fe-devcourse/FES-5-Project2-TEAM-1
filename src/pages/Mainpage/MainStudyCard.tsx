import { useEffect, useState, startTransition } from "react";
import type { Tables } from "../../supabase/database.types";
import supabase from "../../supabase/supabase";
import S from "./MainStudyCard.module.css";
import Card from "../../components/Layout/Card";
import { debounce } from "@/utils/debounce";

type Board = Tables<"board">;

type BoardWithTag = Board & {
  board_tag: {
    board_id: string;
    tag_id: string;
    color_code: string | null;
    hash_tag: string | null;
  }[];
};

interface Props {
  search: string;
}

function MainStudyCard({ search }: Props) {
  const [cards, setCards] = useState<BoardWithTag[]>([]);
  const [displayCards, setDisplayCards] = useState<BoardWithTag[]>([]);
  const [initialDisplayCards, setInitialDisplayCards] = useState<BoardWithTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("board")
        .select("*, board_tag(*)")
        .eq("active", true);

      if (data) {
        const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 6);

        startTransition(() => {
          setCards(data);
          setInitialDisplayCards(shuffled);
          setDisplayCards(shuffled);
        });
      } else {
        console.error("게시글 불러오기 실패", error?.message);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setDisplayCards(initialDisplayCards);
      return;
    }

    const handler = debounce((value: string) => {
      const lower = value.toLowerCase();

      const filtered = cards.filter((card) =>
        (card.title ?? "").toLowerCase().includes(lower) ||
        (card.contents ?? "").toLowerCase().includes(lower) ||
        (card.address ?? "").toLowerCase().includes(lower) ||
        (card.board_cls ?? "").toLowerCase().includes(lower)
      );

      const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 6);
      setDisplayCards(shuffled);
    }, 300);

    handler(search);
  }, [search, cards]);

  return (
    <section className={S.container}>
      {isLoading ? (
        <div className={S.spinnerWrapper}>
          <svg className={S.spinner} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="80" height="80">
            <g>
              <path d="M50 27.5c-2.2 0-4-1.8-4-4v-12c0-2.2 1.8-4 4-4s4 1.8 4 4v12c0 2.2-1.8 4-4 4z" fill="#c5a98f" />
              <path d="M34.1 34.1c-1.6 1.6-4.1 1.6-5.7 0l-8.5-8.5c-1.6-1.6-1.6-4.1 0-5.7s4.1-1.6 5.7 0l8.5 8.5c1.6 1.6 1.6 4.1 0 5.7z" fill="#ffc1cb" />
              <path d="M27.5 50c0 2.2-1.8 4-4 4h-12c-2.2 0-4-1.8-4-4s1.8-4 4-4h12c2.2 0 4 1.8 4 4z" fill="#bbdad9" />
              <path d="M34.1 65.9c1.6 1.6 1.6 4.1 0 5.7l-8.5 8.5c-1.6 1.6-4.1 1.6-5.7 0-1.6-1.6-1.6-4.1 0-5.7l8.5-8.5c1.6-1.6 4.1-1.6 5.7 0z" fill="#a8b980" />
              <path d="M50 72.5c2.2 0 4 1.8 4 4v12c0 2.2-1.8 4-4 4s-4-1.8-4-4v-12c0-2.2 1.8-4 4-4z" fill="#c5a98f" />
              <path d="M65.9 65.9c1.6-1.6 4.1-1.6 5.7 0l8.5 8.5c1.6 1.6 1.6 4.1 0 5.7-1.6 1.6-4.1 1.6-5.7 0l-8.5-8.5c-1.6-1.6-1.6-4.1 0-5.7z" fill="#ffc1cb" />
              <path d="M72.5 50c0-2.2 1.8-4 4-4h12c2.2 0 4 1.8 4 4s-1.8 4-4 4h-12c-2.2 0-4-1.8-4-4z" fill="#bbdad9" />
              <path d="M65.9 34.1c-1.6-1.6-1.6-4.1 0-5.7l8.5-8.5c1.6-1.6 4.1-1.6 5.7 0 1.6 1.6 1.6 4.1 0 5.7l-8.5 8.5c-1.6 1.6-4.1 1.6-5.7 0z" fill="#a8b980" />
            </g>
          </svg>
        </div>
      ) : displayCards.length === 0 ? (
        <div className={S.nothing}>
          <p>
            앗… 아직 관련 글이 없습니다.
            <br />
            🍃🍃🍃
          </p>
          <img src="/images/서치이미지.png" alt="검색 결과 없음" />
        </div>
      ) : (
        <div className={S.cardGrid}>
          {displayCards.map((card) => (
            <Card key={card.board_id} card={card} />
          ))}
        </div>
      )}
    </section>
  );
}

export default MainStudyCard;
