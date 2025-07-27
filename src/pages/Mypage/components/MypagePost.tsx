import { useEffect, useState } from "react";
import compareUserId from "../../../utils/compareUserId"
import type { Tables } from "src/supabase/database.types";
import supabase from "@/supabase/supabase";
import S from './MypagePost.module.css';

/**
 * - 마이페이지 포스트 확인
    - board 테이블의 profile_id와 post테이블의 profile_id와 현재 접속한 유저 id가 같은걸 기준으로, 작성자가 본인인 경우의 글에대해서만 title과 contents 불러오기
    - title은 모두 보이고
    - contents는 truncate로 몇글자 이내만 보이게
    - 리스트로 뿌리기
 */

type Post = Tables<'post'>
type Board = Tables<'board'>
type NewBoard = Pick<Board,'board_id'|'title'|'contents'>;

// 데이터 불러오는 조건 설정해주기(user_id 바뀔때마다?)

function MypagePost() {
  // const [currentUserId, setCurrentUserId] = useState<string|null>(null);
  const [boards, setBoards] = useState<Board[]|null>(null);
  const [posts, setPosts] = useState<Post[]|null>(null);
  const [newBoards, setNewBoards] = useState<NewBoard[]|null>(null);
  
  useEffect(()=>{
    const fetchPosts = async() => {
      const postData = await compareUserId('11e880fd-65ca-4778-b8e9-1888c1e65233','post');
      if(!postData) return console.error('포스트 불러오기 실패');
      setPosts(postData);
    }
    fetchPosts();
  },[])
  // 스크랩과 같은 생각

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


  useEffect(()=>{
    if(!boards) return;
    const copyBoardContentsList:string[] = boards.map(({contents})=>contents);

    setNewBoards(
      boards.map(({board_id, title},idx)=>{
        return {board_id, title, contents : copyBoardContentsList[idx].slice(0,50)}
        }
      )
    )

  },[boards])


  return (
    <>
      <h2 className={S.sectionName}>포스트</h2>
      <section className={S.postContainer}>
        <ul className={S.postList}>
          {
            newBoards && newBoards.map(({board_id, title, contents})=>(
              <li key={board_id} className={S.post}>
                <p className={S.postTitle}>{title}</p>
                <p className={S.postContent}>{contents}</p>
              </li>
            ))
          }
        </ul>
      </section>
    </>
  )
}
export default MypagePost