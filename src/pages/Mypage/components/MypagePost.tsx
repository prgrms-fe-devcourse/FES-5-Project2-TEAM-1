import { useEffect, useState } from "react";
import type { Tables } from "src/supabase/database.types";
import supabase from "@/supabase/supabase";
import S from './MypagePost.module.css';
import { Link } from "react-router-dom";

type Post = Tables<'post'>
type Board = Tables<'board'>

interface Props {
  profileId : string;
}

function MypagePost({profileId}:Props) {
  const [posts, setPosts] = useState<Post[]|null>(null);
  const [boards, setBoards] = useState<Board[]|null>(null);

  
  useEffect(()=>{
    if(!profileId) return;
    const fetchPosts = async() => {
      const {data, error} = await supabase.from('board').select('*').eq('profile_id',profileId);
      if(error) return console.error('포스트 불러오기 실패');
      setPosts(data);
    }
    fetchPosts();
  },[profileId])

  useEffect(()=>{
    const fetchBoards = async() => {
      if (!posts) return;
      const data = await Promise.all(posts.map( async(post)=> {  
        const {data, error} = await supabase
        .from('board')
        .select('*')
        .eq('board_id',post.board_id)
        .single(); 
      
        if(error) return console.error('보드 불러오기 실패');
      
        return data; 
      }));
      
      if(!data) return;
      setBoards(data);
    }

    fetchBoards();
  },[posts])

  return (
    <>
      <h2 className={S.sectionName}>포스트</h2>
      {
        posts && posts.length > 0 && boards ? (
          <section className={S.postContainer}>
            <ul className={S.postList}>
              {
                boards && boards.map(({board_id, title, contents})=>(
                  <li key={board_id} className={S.post}>
                      <Link to={`/channel/${board_id}`}>
                      <div className={S.postTitle}>{title}</div>
                      <div className={S.postContent}>{contents}</div>
                    </Link>
                  </li>
                ))
              }
            </ul>
          </section>
        ) : (
          <div className={S.nothing}>
            <img src="/images/emptyContents.png" alt="작성한 포스트 없음" />
            <p>
              아직 작성한 포스트가 없습니다<br />
              스터디에서 모집 글을 작성해보세요!<br />
              
            </p>
          </div>
        )

      }
    </>
  )
}
export default MypagePost