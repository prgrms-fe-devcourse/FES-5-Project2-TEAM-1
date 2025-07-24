
import { useEffect, useState } from 'react';
import StudyCard from './StudyCard';
import S from './StudyCardList.module.css';
import supabase from '../../supabase/supabase';
import type { Database } from 'src/supabase/database.types';

type Board = Database['public']['Tables']['board']['Row'];

interface Props{
  search:string;
}

function getDDay(dateStr: string): string {
  const today = new Date();
  const due = new Date(dateStr);
  const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? `D - ${diff}` : '모집 마감';
}

function StudyCardList({search}:Props) {

  const [boards, setBoards] = useState<Board []>([]);
  
  useEffect(()=>{
    const fetchBoards = async()=>{
      const {data, error} = await supabase.from('board')
      .select('*');

      if(error) console.error('에러 발생', error);
      else setBoards(data); 
    };
    fetchBoards();
  },[])


  const filteredSearchBar = boards.filter((board)=>{

    const keyword = search.toLowerCase();

    return (
      board.title.toLowerCase().includes(keyword) ||
      board.contents.toLowerCase().includes(keyword) ||
      board.board_cls.toLowerCase().includes(keyword) ||
      board.address.toLowerCase().includes(keyword) 
    )
});

  return (
    <section
  className={`${S.list} ${filteredSearchBar.length === 0 ? S.nothingWrapper : ""}`}
>
  {filteredSearchBar.length === 0 ? (
      <div className={S.nothing}>
        <p>앗… 아직 관련 글이 없습니다.<br />🍃🍃🍃
        </p>
        <img src="/public/images/서치이미지.png" alt="" />
      </div>

  ) : (
    filteredSearchBar.map((board) => (
      <StudyCard
        key={board.board_id}
        title={board.title}
        contents={board.contents}
        member={Number(board.member)}
        likes={board.likes}
        status={board.join_cls}
        due={getDDay(board.due_date)}
        tags={[board.board_cls]}
        tags_address={board.address}
      />
    ))
  )}
</section>
  );
}

export default StudyCardList;
