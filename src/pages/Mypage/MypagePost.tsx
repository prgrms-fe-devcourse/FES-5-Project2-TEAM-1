import { useEffect, useState } from "react";
import compareUserId from "../../utils/compareUserId"
import type { Tables } from "src/supabase/database.types";

type Posts = Tables<'post'>

// 데이터 불러오는 조건 설정해주기(user_id 바뀔때마다?)

function MypagePost() {
  // const [currentUserId, setCurrentUserId] = useState<string|null>(null);
  const [posts, setPosts] = useState<Posts[]|null>(null)

  // setCurrentUserId('test1');

  useEffect(() => {
      const fetchPosts = async () => {
        // if(!currentUserId) return;
        const result = await compareUserId('test1','post');
        setPosts(result);
      };
      fetchPosts();
    }, []);
    console.log('포스트 불러오기',posts);
    
  return (
    <div>MypagePost</div>
  )
}
export default MypagePost