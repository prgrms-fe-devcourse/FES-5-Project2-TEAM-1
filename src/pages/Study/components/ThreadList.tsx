import type { Tables } from '@/supabase/database.types';
import S from './ThreadList.module.css'
import { commentTime } from './utills/commentTime';
import { useEffect, useState } from 'react';
import supabase from '@/supabase/supabase';
import ThreadReplyComponent from './ThreadReplyComponent';


type Thread = Tables<"thread">;
type ThreadReply = Tables<'thread_reply'>
interface Props{
  data: Thread,
  onDelete : () => void
}

function ThreadList({ data,onDelete }: Props) {

  const { contents, likes, create_at,thread_id,profile_id} = data
  const [isPress,setIsPress] = useState(false)
  const [like, setLike] = useState(likes)
  const [isEditing, setIsEditing] = useState(false)
  const [isReplyPress, setIsReplyPress] = useState(false)
  const [content, setContent] = useState(contents)
  const [editContent,setEditContent] = useState(contents)
  const [createReply, setCreateReply] = useState<string>('')
  const [reply,setReply] = useState<ThreadReply[]>([])
  const timeStamp = commentTime(create_at)


  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("thread_reply")
        .select("*")
        .eq("thread_id", thread_id);
      if (error) console.log(error.message);
      if(data) setReply(data);
    }
    fetchData()
  },[thread_id])

  const handleLike = async() => {
    const likeState = isPress ? like - 1 : like + 1
    const nextState = !isPress

    setLike(likeState)
    setIsPress(nextState)
    localStorage.setItem(`like-${data.thread_id}`, JSON.stringify(nextState))
    
    const { error } = await supabase.from('thread_reply').update({
      likes:likeState
    }).eq('thread_id', thread_id).select().single()
    
    if(error) console.log(error.message)
  }

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent) => {
      if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
    }
      if (!editContent.trim()) return;

    const { error } = await supabase.from('thread').update({
      contents:editContent
    }).eq('thread_id',thread_id)
    setContent(editContent)
    setIsEditing(!isEditing)
     if (error) console.error();
  }


  const handleReplyDelete = (targetId: string) => {
    setReply(reply.filter((item) => item.reply_id !== targetId));
  };

  const handleReply = () => {
    setIsReplyPress(!isReplyPress)
  }

  const handleDelete = async () => {
    const deleteComment = confirm("정말로 삭제하시겠습니까?");
    if (deleteComment) {
      const { error } = await supabase
        .from("thread")
        .delete()
        .eq("thread_id", thread_id);
      if (error) {
        console.error("삭제 실패:", error.message);
      }

      if (error) console.error();
      if (!error) onDelete?.();
    }
  };

  const handleSubmitReply = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    const { error } = await supabase.from('thread_reply').insert([{
      thread_id,
      profile_id,
      contents: createReply,
      likes: 0,
      created_at: new Date()
    }])
    if (error) console.log(error.message)
    setCreateReply("");
    
    const { data:threadData } = await supabase.from('thread_reply').select('*').eq('thread_id',thread_id)
    if(threadData) setReply(threadData)
      
  }; 

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (e.key === "Enter" && !e.shiftKey) {
      if (!createReply.trim()) return;
      handleSubmitReply();
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    
    if (e.key === "Enter" && !e.shiftKey) {
       e.preventDefault();
      if (!editContent.trim()) return;
      handleSave(e)
    }
  };

  const recentlyReply = [...reply].sort((a, b) => (
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ))

  return (
    <li className={S.listContainer}>
      <div className={S.writerBox}>
        <div className={S.meta}>
          <div className={S.profile}>
            <img src="/images/너굴.png" alt="" />
            <p>이름</p>
          </div>
          <div className={S.timeStamp}>{timeStamp}</div>
        </div>
        <div className={S.edit}>
          {isEditing ? (
            <>
              <button type="submit" onClick={handleSave}>
                저장
              </button>
              <button type="button" onClick={() => setIsEditing(!isEditing)}>
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
      </div>

      <div className={S.content}>
        <div className={S.partition}></div>
        <div className={S.textContainer}>
          {isEditing ? (
            <input
              className={S.editContent}
              type="text"
              value={editContent}
              onKeyDown={handleEditKeyDown}
              onChange={(e) => setEditContent(e.target.value)}
              autoFocus
            />
          ) : (
            <p>{content}</p>
          )}
        </div>
      </div>
      <div className={S.iconWrap}>
        <div className={S.likeBtn}>
          <button type="button" className={S.like} onClick={handleLike}>
            {isPress ? (
              <img src="/icons/likeActive.png" alt="좋아요 활성화" />
            ) : (
              <img src="/icons/like.svg" alt="" />
            )}
            {like}
          </button>
        </div>
        <div className={S.reply} onClick={handleReply}>
          <button type="button" className={S.comment}>
            ↪ Reply
          </button>
          <span>{reply.length}</span>
        </div>
      </div>
      {isReplyPress && (
        <div>
          <form
            className={S.replyInputBox}
            onSubmit={handleSubmitReply}
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

          {recentlyReply &&
            recentlyReply.map((comment) => (
              <ThreadReplyComponent
                reply={comment}
                key={comment.reply_id}
                onDelete={() => {
                  handleReplyDelete(comment.reply_id);
                }}
              />
            ))}
        </div>
      )}
    </li>
  );
}
export default ThreadList