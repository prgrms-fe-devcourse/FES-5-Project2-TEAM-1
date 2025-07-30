import { useEffect, useState } from "react";
import type { Tables } from "src/supabase/database.types";
import S from './MypageScrap.module.css'
import supabase from "@/supabase/supabase";
import { Link } from "react-router-dom";

type Scrap = Tables<'scrap'>
type Board = Tables<'board'>
type NewBoard = Pick<Board,'board_id'|'title'|'contents'>;

interface Props {
  profileId : string;
}

function MypageScrap({profileId}:Props) {
  const [scraps, setScraps] = useState<Scrap[]|null>(null);
  const [boards, setBoards] = useState<Board[]|null>(null);
  const [newBoards, setNewBoards] = useState<NewBoard[]|null>(null);

  useEffect(()=>{
    if(!profileId) return;
    const fetchScrapsAndBoards = async() => {
      const {data, error} = await supabase.from('scrap').select('*').eq('profile_id',profileId);
      if(error) return console.error('스크랩 불러오기 실패')
      // console.log(data);
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


  
  useEffect(()=>{
    if(!boards) return;
    const copyBoardContentsList:string[] = boards.map(({contents})=>contents);
    const copyBoardtitleList:string[] = boards.map(({title})=>title);

    setNewBoards(
      boards.map(({board_id},idx)=>{
        return {board_id, title:copyBoardtitleList[idx].slice(0,20), contents : copyBoardContentsList[idx].slice(0,50)}
          }
        )
      )

  },[boards])




  return (
    <>
      <h2 className={S.sectionName}>스크랩</h2>
      <section className={S.scrapContainer}>
        <ul className={S.scrapList}>
          {
            newBoards && newBoards.map(({board_id, title, contents})=>(
              <li key={board_id} className={S.scrap}>
                <Link to={`/channel/${board_id}`}>
                  <p className={S.scrapTitle}>{title}</p>
                  <p className={S.scrapContent}>{contents}</p>
                </Link>
              </li>
            ))
          }
        </ul>
      </section>
    </>
  )
}
export default MypageScrap