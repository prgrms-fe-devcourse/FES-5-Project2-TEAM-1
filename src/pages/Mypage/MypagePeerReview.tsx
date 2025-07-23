import { useEffect, useState } from "react"
import type { Tables } from "src/supabase/database.types"
import compareUserId from "../../utils/compareUserId"


type PeerReview = Tables<'peer_review'>

function MypagePeerReview() {
  const [peerReviews, setPeerReviews] = useState<PeerReview[]|null>(null)
  
  useEffect(()=>{
    const fetchPeerReviews = async() => {
      const result = await compareUserId('test1','peer_review');
      setPeerReviews(result);
    }
    fetchPeerReviews();
  },[])
  console.log('리뷰 불러오기',peerReviews);

  return (
    <div>MypagePeerReview</div>
  )
}
export default MypagePeerReview