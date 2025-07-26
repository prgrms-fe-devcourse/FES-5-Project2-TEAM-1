import { useEffect, useState } from 'react';
import S from './ChannelComment.module.css'
import supabase from '@/supabase/supabase';
import type { Tables } from '@/supabase/database.types';
import CommentItem from './CommentItem';


type Comment = Tables<'comment'>

function ChannelComment() {

  const [comments,setComments] = useState<Comment[]>([])

  useEffect(() => {
    const commentItem = async () => {
      const { data } = await supabase.from("comment").select("*");
      if (!data) return;
      setComments(data);
    };
    commentItem();
  }, [comments]);
 
  const handleClickInputBox = () => {
    
  }

  return (
    <div className={S.container}>
      <div className={S.inputScreen}>
        <textarea name="" id="" placeholder="댓글을 적어주세요"></textarea>
        <button type="submit" className={S.commentBtn}>
          댓글
        </button>
      </div>
      <hr />
      <div className={S.recomment}>
        <div className={S.commentAmount}>
          댓글 <span>{comments.length}</span>
        </div>
        <ul className={S.commentList}>
          {comments.map((comment) => (
            <CommentItem comment={comment} key={comment.comment_id}  />
          ))}
        </ul>
      </div>
    </div>
  );
}
export default ChannelComment