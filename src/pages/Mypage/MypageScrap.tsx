import { useEffect, useState } from "react"
import type { Tables } from "src/supabase/database.types"
import compareUserId from "../../utils/compareUserId";
/**
 * - 스크랩 모아보기
    - 현재 접속한 id와 scrap 테이블에 같은 profile_id인지 확인(본인 여부 확인) 하고, 그때의 board_id들 가져와서 해당 title ,contents 뿌리기
 */

type Scrap = Tables<'scrap'>
function MypageScrap() {
  const [scraps, setScraps] = useState<Scrap[]|null>(null);

  // useEffect(()=>{
  //   const fetchScraps = async() => {
  //     const result = await compareUserId('11e880fd-65ca-4778-b8e9-1888c1e65233','scrap');
  //     setScraps(result);
  //   }
  //   fetchScraps();
  // },[])

  // console.log('스크랩 불러오기', scraps)

  return (
    <div>MypageScrap</div>
  )
}
export default MypageScrap