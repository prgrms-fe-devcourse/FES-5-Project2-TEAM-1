import type { Tables } from '@/supabase/database.types'
import S from './Recomment.module.css'
import { commentTime } from './utills/commentTime'
import { useEffect, useState } from 'react'
import supabase from '@/supabase/supabase'

type Props = {
  reply: Tables<'comment_reply'>
  onDelete:() =>void
}
function Recomment({ reply,onDelete }: Props) {
  const { reply_id, contents , created_at,likes } = reply
  const [isPress, setIsPress] = useState(false)
  const [like, setLike] = useState(likes)
  const [isEditing,setIsEditing] = useState(false)
  const [editReply,setEditReply] = useState(contents)
  const [content,setContent] = useState(contents)
   useEffect(() => {
     const storedPress = JSON.parse(
       localStorage.getItem(`like-${reply_id}`) ?? "false"
     );
     setIsPress(storedPress);
   }, [reply_id]);
  
  const handleLikeToggle = async (reply_id: string) => {
   const pressState = isPress ? like - 1 : like + 1;
   const nextState = !isPress;

   setLike(pressState);
   setIsPress(nextState);
   localStorage.setItem(`like-${reply_id}`, JSON.stringify(nextState));

   const { error } = await supabase
     .from("comment_reply")
     .update({ likes: pressState })
     .eq("reply_id", reply_id)
     .select()
     .single();
   if (error) console.error();
  };
 
  const commentTimeCheck = commentTime(created_at)

  const handleSave = async() => {
    const { error } = await supabase.from('comment_reply').update({ contents: editReply }).eq('reply_id', reply_id)
    setIsEditing(!isEditing)
    setContent(editReply)
    if(error) console.log(error.message)
  }

  const handleDelete = async () => {
    const checkDelete = confirm('정말로 삭제하시겠습니까?')
    if (checkDelete) {
         const { error } = await supabase
           .from("comment_reply")
           .delete()
           .eq("reply_id", reply_id);
         if (error) console.error();
         onDelete?.();
    }
  }
    const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!editReply.trim()) return;
        handleSave();
      }
    };

  return (
    <div className={S.container} key={reply_id}>
      <div className={S.profileImage}>
        <img src="/images/여울.png" alt="프로필" />
      </div>
      <div className={S.contentBox}>
        <div className={S.meta}>
          <div className={S.userInfo}>
            <span className={S.username}>User</span>
            <span className={S.time}>{commentTimeCheck}</span>
          </div>
          <div className={S.edit}>
            {
              isEditing ? (
              <>
                <button type="submit" onClick={handleSave}>저장</button>
                  <button type="button" onClick={()=>setIsEditing(!isEditing)}>취소</button>
              </>
            ) : (
              <button type="submit" onClick={()=>setIsEditing(!isEditing)}>수정</button>
              )
            }

            <button type="submit" onClick={handleDelete}>삭제</button>
          </div>
        </div>
        {
          isEditing ? (
            <input
              type="text"
              value={editReply}
              onChange={(e) => setEditReply(e.target.value)}
              onKeyDown={handleEditKeyDown}
              autoFocus
            />
          ): (
             <div className={S.text}>{content}</div>
          )
        }
       
        <div className={S.actions}>
          <div className={S.likeBtn}>
            <button type="button" onClick={() => handleLikeToggle(reply_id)}>
              {isPress ? (
                <img src="/icons/likeActive.png" alt="좋아요 활성화" />
              ) : (
                <img src="/icons/like.svg" alt="" />
              )}
            </button>
            <span>{like}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Recomment