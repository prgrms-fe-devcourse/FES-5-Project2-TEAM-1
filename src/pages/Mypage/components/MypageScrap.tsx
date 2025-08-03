import { useEffect, useState } from "react";
import type { Tables } from "src/supabase/database.types";
import S from './MypageScrap.module.css'
import supabase from "@/supabase/supabase";
import { Link } from "react-router-dom";

type Scrap = Tables<'scrap'>
type Board = Tables<'board'>

interface Props {
  profileId : string;
}

function MypageScrap({profileId}:Props) {
  const [scraps, setScraps] = useState<Scrap[]|null>(null);
  const [boards, setBoards] = useState<Board[]|null>(null);

  useEffect(()=>{
    if(!profileId) return;
    const fetchScrapsAndBoards = async() => {
      const {data, error} = await supabase.from('scrap').select('*').eq('profile_id',profileId);
      if(error) return console.error('스크랩 불러오기 실패')
      setScraps(data);
    }
    fetchScrapsAndBoards();
  },[profileId])


  
  
  useEffect(()=>{
    const fetchBoards = async() => {
      if (!scraps) return;
      const data = await Promise.all(scraps.map( async(scrap)=> {  
        const {data, error} = await supabase
        .from('board')
        .select('*')
        .eq('board_id',scrap.board_id)
        .single();   
        
        if(error) return console.error('보드 불러오기 실패');
    
        return data; 
    
      }));
      if(!data) return;
      setBoards(data);
    }

    fetchBoards();
  },[scraps])

  return (
    <>
      <h2 className={S.sectionName}>스크랩</h2>
      {
        scraps && scraps.length > 0 && boards ? (
          <section className={S.scrapContainer}>
            <ul className={S.scrapList}>
              {
                boards && boards.map(({board_id, title, contents})=>(
                  <li key={board_id} className={S.scrap}>
                    <Link to={`/channel/${board_id}`}>
                      <div className={S.scrapTitle}>{title}</div>
                      <div className={S.scrapContent}>{contents}</div>
                    </Link>
                  </li>
                ))
              }
            </ul>
          </section>
        ) : (
          <div className={S.nothing}>
            <img src="/images/emptyContents.png" alt="스크랩 없음" />
            <p>
              아직 스크랩된 글이 없습니다 <br />
              스터디에서 글을 스크랩해서 한 눈에 확인해보세요!<br />
              
            </p>
          </div>
        )
      }
    </>
  )
}
export default MypageScrap