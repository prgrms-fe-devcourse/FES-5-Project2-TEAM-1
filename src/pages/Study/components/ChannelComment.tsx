import { useEffect, useRef, useState } from 'react';
import S from './ChannelComment.module.css'
import supabase from '@/supabase/supabase';
import type { Tables } from '@/supabase/database.types';
import CommentItem from './CommentItem';
import { useAuth } from '@/auth/AuthProvider';
import { IsMineProvider } from '@/components/context/isMine';




type Props = Tables<'board'>
type Comment = Tables<'comment'>

type ReplyWithUser = Comment & {
  user_profile: Tables<"user_profile"> & {
    user_base: Tables<"user_base">;
  };
};

function ChannelComment(card:Props) {
 
  const {profileId}= useAuth()
  const { board_id } = card
  const [writeComment,setWriteComment] = useState('')
  const [commentedUser, setCommentedUser] = useState<ReplyWithUser[]>([])


  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  
  // MarckDownconverter높이수정
  // 글쓰기 이미지크기 유동적조정
  // 스레드채널 => 멤버전체목록
  // 수정 삭제도 본인만 보이게

  
  useEffect(() => {
    const commentItem = async () => {
      const { data: TableData } = await 
        supabase
          .from("comment")
          .select("*,user_profile(*,user_base(*))")
          .eq("board_id", board_id)
   
      if (!TableData) return
      setCommentedUser(TableData)
    };
    commentItem();
  }, [board_id]);

  const handleClickInputBox = (e:React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if(target.closest('button'))return
    textareaRef.current?.focus();
  }

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
     
    if (writeComment.trim() === '') return;
 
    const { error } = await supabase.from("comment").insert([
      {
        board_id,
        profile_id: profileId,
        contents: writeComment,
        likes: 0,
        create_at: new Date(),
      },
    ]);

    if (error) {
      console.log(error.message)
      return;
    }

    setWriteComment("");

    const { data: commentData } = await supabase
      .from("comment")
      .select("*,user_profile(*,user_base(*))")
      .eq("board_id", board_id)

    if (commentData) setCommentedUser(commentData);
  };

  const handleDeleteComment = (targetId: string) => {
    setCommentedUser(prev =>prev.filter(c => c.comment_id !== targetId))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
  e.preventDefault(); 
  const form = e.currentTarget.form;
  if (form) {
    form.requestSubmit(); 
      }
    }   
  };

  const matchComment = commentedUser.filter(comment => comment.board_id === board_id).sort((a,b) => new Date(b.create_at).getTime() - new Date(a.create_at).getTime())

  return (
    <div className={S.container}>
      <div className={S.inputScreen} onClick={handleClickInputBox}>
        <form onSubmit={handleSubmit}>
          <textarea
            ref={textareaRef}
            value={writeComment}
            placeholder="댓글을 적어주세요"
            onChange={(e) => setWriteComment(e.target.value)}
            onKeyDown={handleKeyDown}
          ></textarea>
          <button type="submit" className={S.commentBtn}>
            댓글
          </button>
        </form>
      </div>
      <hr />
      <div className={S.recomment}>
        <div className={S.commentAmount}>
          댓글 <span>{matchComment.length}</span>
        </div>
        <ul className={S.commentList}>
          {matchComment.map((comment) => (
            <IsMineProvider
              writerProfileId={comment.user_profile.profile_id}
              key={comment.comment_id}
            >
              <CommentItem
                comment={comment}
                onDelete={() => handleDeleteComment(comment.comment_id)}
                userName={comment.user_profile.user_base.nickname}
                userImage={comment.user_profile.profile_images}
                profileId={profileId}
              />
            </IsMineProvider>
          ))}
        </ul>
      </div>
    </div>
  );
}
export default ChannelComment