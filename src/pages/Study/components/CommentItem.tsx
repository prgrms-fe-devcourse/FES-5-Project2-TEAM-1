import type { Tables } from '@/supabase/database.types'
import S from './CommentItem.module.css'
import { useState } from 'react';
import supabase from '@/supabase/supabase';



interface Props{
  comment: Tables<'comment'>

}

function CommentItem({ comment}: Props) {
  const { contents, likes, create_at, comment_id } = comment;

 const [like, setLike] = useState<number>(likes);
 const [isPress, setIsPress] = useState(false);

 const handleLikeToggle = async (comment_id: string) => {
   const pressState = isPress ? like - 1 : like + 1;
   const nextState = !isPress;

   setLike(pressState);
   setIsPress(nextState);
   const { error } = await supabase
     .from("comment")
     .update({ likes: pressState })
     .eq("comment_id", comment_id)
     .select()
     .single();
   if (error) console.error();
   console.log("updates like", {
     comment_id,
     pressState,
   });
  };
  
  return (
    <li className={S.container} key={comment_id}>
        <div className={S.profileImage}>
          <img src="/images/너굴.png" alt="프로필" />
        </div>
        <div className={S.contentBox}>
          <div className={S.meta}>
            <span className={S.username}>User</span>
            <span className={S.time}>{create_at}</span>
          </div>
          <div className={S.text}>{contents}</div>
          <div className={S.actions}>
            <div className={S.likeBtn}>
              <button
                type="button"
                onClick={() => handleLikeToggle(comment_id)}
              >
                {isPress ? (
                  <img src="/icons/likeActive.png" alt="좋아요 활성화" />
                ) : (
                  <img src="/icons/like.svg" alt="" />
                )}
              </button>
              <span>{likes}</span>
            </div>
            <button type="button">↪ Reply</button>
          </div>
        </div>
      </li >
  );
}
export default CommentItem