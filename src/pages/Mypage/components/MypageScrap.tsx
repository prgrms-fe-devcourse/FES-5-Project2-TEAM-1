import { useEffect, useState } from "react";
import type { Tables } from "src/supabase/database.types";
import compareUserId from "../../../utils/compareUserId";
import S from './MypageScrap.module.css'
import supabase from "@/supabase/supabase";
/**
 * - 스크랩 모아보기
    - 현재 접속한 id와 scrap 테이블에 같은 profile_id인지 확인(본인 여부 확인) 하고, 그때의 board_id들 가져와서 해당 title ,contents 뿌리기

    - 보드 contents 일정 글자 이하로만 보이게 설정해야함
 
    */
type Board = Tables<'board'>

function MypageScrap() {
  const [boardContents, setBoardContents] = useState<Board[]|null>(null);


  useEffect(()=>{
    const fetchScrapsAndBoards = async() => {
      const scrapData = await compareUserId('11e880fd-65ca-4778-b8e9-1888c1e65233','scrap');

      const boardData = await Promise.all(scrapData!.map( async(scrap)=> {  
        const {data, error} = await supabase
        .from('board')
        .select('*')
        .eq('board_id',scrap.board_id)
        .single();   
        return data; 
      }));
      if(!boardData) return;
      setBoardContents(boardData);
    }

    fetchScrapsAndBoards();
    console.log('스크랩 & 보드 패치 완료')
  },[])
  
  // console.log('보드내용 : ', boardContents)


  return (
    <>
      <p className={S.sectionName}>스크랩</p>
      <div className={S.scrapContainer}>
        <ul className={S.scrapList}>
          {
            boardContents && boardContents.map(({board_id, title, contents})=>(
              <li key={board_id} className={S.scrap}>
                <p className={S.scrapTitle}>{title}</p>
                <p className={S.scrapContent}>{contents.length>50 ? contents.slice(0,50) : contents}</p>
              </li>
            ))
          }
        </ul>
      </div>
    </>
  )
}
export default MypageScrap