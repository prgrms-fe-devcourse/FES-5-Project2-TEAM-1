import { useEffect, useRef, useState } from 'react';
import S from './ChannelComment.module.css'
import supabase from '@/supabase/supabase';
import type { Tables } from '@/supabase/database.types';
import CommentItem from './CommentItem';




type Props = Tables<'board'>
type Comment = Tables<'comment'>

function ChannelComment(card:Props) {

  const {board_id,profile_id} = card
  const [writeComment,setWriteComment] = useState('')
  const [comments, setComments] = useState<Comment[]>([])
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  
  useEffect(() => {
    const commentItem = async () => {
      const { data } = await supabase.from("comment").select("*");
      if (!data) return;
      setComments(data);
    };
    commentItem();
  },[]);
 
  const handleClickInputBox = (e:React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if(target.closest('button'))return
    textareaRef.current?.focus();
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 
    const { error } = await supabase.from("comment").insert([
      {
        board_id: String(board_id),
        profile_id: String(profile_id),
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
      .select("*")
      .eq("board_id", board_id);

    if (commentData) setComments(commentData);
  };

  const matchComment = comments.filter(comment => comment.board_id === board_id)

  return (
    <div className={S.container}>
      <div className={S.inputScreen} onClick={handleClickInputBox}>
        <form onSubmit={handleSubmit}>
          <textarea
            name=""
            id=""
            ref={textareaRef}
            value={writeComment}
            placeholder="댓글을 적어주세요"
            onChange={(e)=>setWriteComment(e.target.value)}
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
            <CommentItem comment={comment}  key={comment.comment_id} />
          ))}
        </ul>
      </div>
    </div>
  );
}
export default ChannelComment