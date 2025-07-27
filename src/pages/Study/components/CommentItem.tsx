import type { Tables } from '@/supabase/database.types'
import S from './CommentItem.module.css'
import { useEffect, useState } from 'react';
import supabase from '@/supabase/supabase';
import Recomment from './Recomment';



interface Props{
  comment: Tables<'comment'>,
}
type Reply = Tables<'comment_reply'>


function CommentItem({comment}: Props) {
  const { contents, likes, create_at, comment_id,profile_id } = comment;

  const [like, setLike] = useState<number>(likes);
  const [isPress, setIsPress] = useState(false);
  const [isReplyPress, setIsReplyPrss] = useState(false)
  const [reply,setReply] = useState<Reply[]>([])
   useEffect(() => {
    const storedPress = JSON.parse(localStorage.getItem(`like-${comment_id}`) ?? "false");
    setIsPress(storedPress) 
   }, [comment_id]);
  
  useEffect(() => {
      const comment_reply = async () => {
        const { data } = await supabase.from("comment_reply").select("*").eq('comment_id', comment_id)
        if(data) setReply(data);
      };
      comment_reply();
  },[comment_id])

  
 const handleLikeToggle = async (comment_id: string) => {
   const pressState = isPress ? like - 1 : like + 1;
   const nextState = !isPress;

   setLike(pressState);
   setIsPress(nextState);
   localStorage.setItem(`like-${comment_id}`, JSON.stringify(nextState))
  
   const { error } = await supabase
     .from("comment")
     .update({ likes: pressState })
     .eq("comment_id", comment_id)
     .select()
     .single();
   if (error) console.error();
  };

  const handleReply = () => {
    setIsReplyPrss(!isReplyPress)
  }

  const handleSubmitReply = async() => {
    await supabase.from('comment_reply').insert([{
      comment_id,
      profile_id,
      contents,
      likes:0,
      create_at:new Date()
    }])
  }

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
            <button type="button" onClick={() => handleLikeToggle(comment_id)}>
              {isPress ? (
                <img src="/icons/likeActive.png" alt="좋아요 활성화" />
              ) : (
                <img src="/icons/like.svg" alt="" />
              )}
            </button>
            <span>{like}</span>
          </div>
          <div className={S.recomment} onClick={handleReply }>
            <button type="button">↪ Reply</button>
            <span>10</span>
          </div>
        </div>
        {isReplyPress && (
          <div>
            <form className={S.replyInputBox} onSubmit={handleSubmitReply}>
              <textarea
                className={S.replyInput}
                placeholder="답글을 입력하세요"
              ></textarea>
              <button type="button" className={S.replyButton}>
                등록
              </button>
            </form>

            {reply &&
              reply.map((comment) => (
                <Recomment
                  reply = {reply}
                  key={comment.comment_id}
                  handleLikeToggle={() => handleLikeToggle(comment_id)}
                />
              ))}
          </div>
        )}
      </div>
    </li>
  );
}
export default CommentItem