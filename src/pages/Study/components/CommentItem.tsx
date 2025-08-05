import type { Tables } from '@/supabase/database.types'
import S from './CommentItem.module.css'
import { useEffect, useState } from 'react';
import supabase from '@/supabase/supabase';
import Recomment from './Recomment';
import { commentTime } from './utills/commentTime';
import { useIsMine } from '@/components/context/useIsMine';
import { IsMineProvider } from '@/components/context/isMine';
import { showConfirmAlert } from '@/utils/sweetAlert';




interface Props {
  comment: Tables<'comment'>,
  onDelete: () => void,
  userName: string|null
  userImage?: string
  profileId:string | null
}
type Reply = Tables<"comment_reply"> & {
  user_profile: Tables<"user_profile"> & {
    user_base: Tables<"user_base">;
  };
};


function CommentItem({ comment, onDelete, userImage, userName, profileId }: Props) {
  const { isMine } = useIsMine();
  const { contents, likes, create_at, comment_id } = comment;
  const [like, setLike] = useState(likes);
  const [isPress, setIsPress] = useState(false);
  const [isReplyPress, setIsReplyPrss] = useState(false)
  const [reply, setReply] = useState<Reply[]>([])
  const [createReply, setCreateReply] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editContent,setEditContent] = useState(contents)
  const [content,setContent] = useState(contents)
  const commentTimeCheck = commentTime(create_at);
  
  
  useEffect(() => {
    const storedPress = JSON.parse(localStorage.getItem(`like-${comment_id}`) ?? "false");
    setIsPress(storedPress) 
   }, [comment_id]);
  
  useEffect(() => {
      const comment_reply = async () => {
        const { data } = await supabase
          .from("comment_reply")
          .select("*,user_profile(*,user_base(*))")
          .eq("comment_id", comment_id)
          .order("created_at", { ascending: false });

        if(data) setReply(data);
      };
      comment_reply();
  }, [comment_id])
  
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

  const handleSubmitReply = async (e?:React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault(); 
    if (!createReply.trim()) return;
    
    const {error} = await supabase.from('comment_reply').insert([{
      comment_id,
      profile_id:profileId,
      contents:createReply,
      likes:0
    }]).select()

    if(error) console.log(error.message)
    if (!error) setCreateReply('')
    
    const { data:replyData } = await supabase
      .from("comment_reply")
      .select("*,user_profile(*,user_base(*))")
      .eq('comment_id', comment_id)
      if(!replyData) return
      setReply(replyData);
  }

  const handleSave = async() => {
    const {error} = await supabase.from('comment_reply').update({contents:editContent}).eq('comment_id',comment_id)
    setIsEditing(!isEditing) 
    setContent(editContent);
    if(error) console.error()
  }
  
  const handleDelete = async () => {
         showConfirmAlert(
           "정말로 댓글을 삭제하시겠습니까",
           "확인을 누르면 삭제됩니다"
         )
         .then((result) => {
          if(result.isConfirmed) dataDelete()
         })
  }

  const dataDelete = async () => {
    try {
      const { error } = await supabase
        .from("comment")
        .delete()
        .eq("comment_id", comment_id);
      if (error) console.error(error);
      if (!error) onDelete?.();
    } catch (error) {
      console.error(error);
    }
  };


  const handleReplyDelete = (targetId:string) => {
    setReply(prev => prev.filter(c => c.reply_id !== targetId))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
       e.preventDefault();
      if (!createReply.trim()) return;
      handleSubmitReply();
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!editContent.trim()) return;
      handleSave();
    }
  }

  return (
    <li className={S.container} key={comment_id}>
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
                <button type="button" onClick={() => setIsEditing(!isEditing)}>
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
          <textarea
            className={S.textarea}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleEditKeyDown}
            autoFocus
            rows={3}
          ></textarea>
        ) : (
          <div className={S.text}>{content}</div>
        )}

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
          <div className={S.recomment} onClick={handleReply}>
            <button type="button">↪ Reply</button>
            <span>{reply.length}</span>
          </div>
        </div>
        {isReplyPress && (
          <div>
            <form
              className={S.replyInputBox}
              onSubmit={(e) => handleSubmitReply(e)}
            >
              <textarea
                className={S.replyInput}
                value={createReply}
                placeholder="답글을 입력하세요"
                onKeyDown={handleKeyDown}
                onChange={(e) => setCreateReply(e.target.value)}
              ></textarea>
              <button type="submit" className={S.replyButton}>
                등록
              </button>
            </form>

            {reply && reply.map((comment) => {
              return (
                <IsMineProvider
                  writerProfileId={comment.user_profile.profile_id}
                  key={comment.reply_id}
                >
                  <Recomment
                    reply={comment}
                    onDelete={() => handleReplyDelete(comment.reply_id)}
                    userName={comment.user_profile.user_base.nickname}
                    userImage={comment.user_profile.profile_images}
                  />
                </IsMineProvider>
              );
            })}
          </div>
        )}
      </div>
    </li>
  );
}
export default CommentItem