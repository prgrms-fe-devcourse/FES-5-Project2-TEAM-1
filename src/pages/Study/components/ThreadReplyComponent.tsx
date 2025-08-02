import { useEffect, useState } from 'react';
import S from './ThreadReplyComponent.module.css'
import type { Tables } from '@/supabase/database.types';
import { commentTime } from './utills/commentTime';
import supabase from '@/supabase/supabase';
import { useIsMine } from '@/components/context/useIsMine';


type ThreadReply = Tables<'thread_reply'>
interface Prop {
  reply: ThreadReply;
  onDelete: () => void;
  userName: string | null
  userImage?: string;
}

function ThreadReplyComponent({reply,onDelete,userName,userImage}:Prop) {

  const { created_at, contents, likes, reply_id } = reply
  const { isMine } =useIsMine()

  const [isEditing, setIsEditing] = useState(false)
  const [editReply, setEditReply] = useState(contents)
  const [content,setContent] =useState(contents)
  const [isPress, setIsPress] = useState(false)
  const [like,setLike] = useState<number>(likes ?? 0)
  const commentTimeCheck = commentTime(created_at)

  useEffect(() => {
    const storedPress = JSON.parse(localStorage.getItem(`like-${reply_id}`) ?? 'false') 
    setIsPress(storedPress)
  },[reply_id])

  const handleLikeToggle = async () => {
    
    const pressState = isPress ? like - 1 : like + 1
    const nextState = !isPress
    setLike(pressState)
    setIsPress(nextState)
    localStorage.setItem(`like-${reply_id}`, JSON.stringify(nextState));

    const { error } = await supabase.from('thread_reply').update({
      likes: pressState
    }).eq('reply_id', reply_id).select().single()
    if(error) console.log(error.message)
  };  
  

  const handleSave = async() => {
    const { error } = await supabase.from('thread_reply').update({
      contents:editReply
    }).eq('reply_id', reply_id)
    setIsEditing(!isEditing)
    setContent(editReply)
    if(error) console.log(error.message) 
  }
  
  const handleDelete = async() => {
       const deleteComment = confirm("정말로 삭제하시겠습니까?");
       if (deleteComment) {
         const { error } = await supabase
           .from("thread_reply")
           .delete()
           .eq("reply_id", reply_id);
          if(error) console.log(error.message)
         if (!error) onDelete?.();
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
    <div className={S.container}>
      <div className={S.profileImage}>
        <img src={userImage} alt="유저 프로필 이미지" />
      </div>
      <div className={S.contentBox}>
        <div className={S.meta}>
          <div className={S.userInfo}>
            <span className={S.username}>{userName}</span>
            <span className={S.time}>{commentTimeCheck}</span>
          </div>
          {isMine && (
            <div className={S.edit}>
              {isEditing ? (
                <>
                  <button type="submit" onClick={handleSave}>
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    취소
                  </button>
                </>
              ) : (
                <button type="submit" onClick={() => setIsEditing(!isEditing)}>
                  수정
                </button>
              )}

              <button type="submit" onClick={handleDelete}>
                삭제
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <input
            type="text"
            value={editReply}
            onChange={(e) => setEditReply(e.target.value)}
            onKeyDown={handleEditKeyDown}
            autoFocus
          />
        ) : (
          <div className={S.text}>{content}</div>
        )}

        <div className={S.actions}>
          <div className={S.likeBtn}>
            <button type="button" onClick={handleLikeToggle}>
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
export default ThreadReplyComponent