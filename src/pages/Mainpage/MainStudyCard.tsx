
import { useEffect, useState } from 'react';
import type { Tables } from '../../supabase/database.types';
import supabase from '../../supabase/supabase';
import S from './MainStudyCard.module.css'
import Card from '../../components/Layout/Card';
import { debounce } from '@/utils/debounce';

type Board = Tables<'board'>;

interface Props {
  search: string;
}

function MainStudyCard({ search }: Props) {
  const [cards, setCards] = useState<Board[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(()=>{
    const handler = debounce((value:string)=>{
      setDebouncedSearch(value);
    },300);

    handler(search);
  },[search]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('board').select('*');
      if (error) {
        console.error('게시글 불러오기 실패:', error.message);
      } else {
        setCards(data);
      }
    };
    fetchData();
  }, []);

  const filteredCards = cards.filter((card) => {
    const lower = debouncedSearch.toLowerCase();
    return (
      (card.title ?? "").toLowerCase().includes(lower) ||
      (card.contents ?? "").toLowerCase().includes(lower) ||
      (card.address ?? "").toLowerCase().includes(lower) ||
      (card.board_cls ?? "").toLowerCase().includes(lower)
    );
  });

  const shuffled = [...filteredCards].sort(()=>Math.random()-0.5);
  const slicedCards = shuffled.slice(0,6);

  return (
    <section className={S.container}>
      {filteredCards.length === 0 ? (
        <div className={S.nothing}>
          <p>
            앗… 아직 관련 글이 없습니다.<br />
            🍃🍃🍃
          </p>
          <img src="/images/서치이미지.png" alt="검색 결과 없음" />
        </div>
      ) : (
        <div className={S.cardGrid}>
          {slicedCards.map((card) => (
            <Card key={card.board_id} card={{ ...card, board_tag: [] }} />
          ))}
        </div>
      )}
    </section>
  );
}

export default MainStudyCard;
