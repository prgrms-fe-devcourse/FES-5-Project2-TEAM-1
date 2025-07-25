
import { useEffect, useState } from 'react';
import type { Tables } from '../../supabase/database.types';
import supabase from '../../supabase/supabase';
import S from './MainStudyCard.module.css'
import Card from '../../components/Layout/Card';

type Board = Tables<'board'>;

interface Props {
  search: string;
}

function MainStudyCard({ search }: Props) {
  const [cards, setCards] = useState<Board[]>([]);

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
    const lower = search.toLowerCase();
    return (
      card.title.toLowerCase().includes(lower) ||
      card.contents.toLowerCase().includes(lower) ||
      card.address.toLowerCase().includes(lower) ||
      card.board_cls.toLowerCase().includes(lower)
    );
  });

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
          {filteredCards.map((card) => (
            <Card key={card.board_id} {...card} />
          ))}
        </div>
      )}
    </section>
  );
}

export default MainStudyCard;
