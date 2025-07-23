import { useEffect, useState } from "react"
import type { Tables } from "src/supabase/database.types"
import compareUserId from "../../utils/compareUserId";


type Scrap = Tables<'scrap'>
function MypageScrap() {
  const [scraps, setScraps] = useState<Scrap[]|null>(null);

  useEffect(()=>{
    const fetchScraps = async() => {
      const result = await compareUserId('test1','scrap');
      setScraps(result);
    }
    fetchScraps();
  },[])

  console.log('스크랩 불러오기', scraps)

  return (
    <div>MypageScrap</div>
  )
}
export default MypageScrap