import type { Tables } from "@/supabase/database.types";
import S from "./ThreadList.module.css";
import { commentTime } from "./utills/commentTime";
import { useEffect, useRef, useState } from "react";
import supabase from "@/supabase/supabase";
import ThreadReplyComponent from "./ThreadReplyComponent";
import { useAuth } from "@/auth/AuthProvider";
import gsap from "gsap";
import { useIsMine } from "@/components/context/useIsMine";
import { IsMineProvider } from "@/components/context/isMine";

type User = Tables<"user_profile"> & {
  user_base: Tables<"user_base">;
};

type ReplyWithUser = ThreadReply & {
  user_profile: User;
};

type Thread = Tables<"thread">;
type ThreadReply = Tables<"thread_reply">;
interface Props {
  data: Thread;
  userName?: string | null;
  userImage?: string;
  onDelete: () => void;
  replyData?: ReplyWithUser[];
}

function ThreadList({ data, onDelete, userName, userImage, replyData }: Props) {
  const { isMine } = useIsMine();
  const { profileId } = useAuth();
  const { contents, likes, create_at, thread_id } = data;
  const [isPress, setIsPress] = useState(false);
  const [like, setLike] = useState(likes);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplyPress, setIsReplyPress] = useState(false);
  const [content, setContent] = useState(contents);
  const [editContent, setEditContent] = useState(contents);
  const [createReply, setCreateReply] = useState<string>("");
  const [reply, setReply] = useState<ReplyWithUser[]>([]);
  const timeStamp = commentTime(create_at);

  const threadRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (threadRef.current) {
      gsap.fromTo(
        threadRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);
  useEffect(() => {
    if (!replyData) return;
    setReply(replyData);
  }, [replyData]);

  const handleLike = async () => {
    const likeState = isPress ? like - 1 : like + 1;
    const nextState = !isPress;

    setLike(likeState);
    setIsPress(nextState);
    localStorage.setItem(`like-${data.thread_id}`, JSON.stringify(nextState));

    const { error } = await supabase
      .from("thread_reply")
      .update({
        likes: likeState,
      })
      .eq("thread_id", thread_id)
      .select()
      .single();

    if (error) console.log(error.message);
  };

  const handleSave = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent
  ) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    if (!editContent.trim()) return;

    const { error } = await supabase
      .from("thread")
      .update({
        contents: editContent,
      })
      .eq("thread_id", thread_id);
    setContent(editContent);
    setIsEditing(!isEditing);
    if (error) console.error();
  };

  const handleReplyDelete = (targetId: string) => {
    setReply(reply.filter((item) => item.reply_id !== targetId));
  };

  const handleReply = () => {
    setIsReplyPress(!isReplyPress);
  };

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
    e?.preventDefault();
    if (!createReply.trim()) return;

    const { error } = await supabase.from("thread_reply").insert([
      {
        thread_id,
        profile_id: profileId,
        contents: createReply,
        likes: 0,
        created_at: new Date(),
      },
    ]);
    if (error) console.log(error.message);
    setCreateReply("");

    const { data: replies } = await supabase
      .from("thread_reply")
      .select("*,user_profile(*,user_base(*))")
      .eq("thread_id", thread_id);
    if (!replies) return;
    setReply(replies);
  };

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
      handleSave(e);
    }
  };

  const recentlyReply = reply?.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <li className={S.listContainer} ref={threadRef}>
      <div className={S.writerBox}>
        <div className={S.meta}>
          <div className={S.profile}>
            <img src={userImage} alt="유저 프로필이미지" />
            <p>{userName}</p>
          </div>
          <div className={S.timeStamp}>{timeStamp}</div>
        </div>
        {isMine && (
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
        )}
      </div>

      <div className={S.content}>
        <div className={S.partition}></div>
        <div className={S.textContainer}>
          {isEditing ? (
            <textarea
              className={S.editContent}
              value={editContent}
              onKeyDown={handleEditKeyDown}
              onChange={(e) => setEditContent(e.target.value)}
              autoFocus
              rows={4}
            
            />
          ) : (
            <p className={S.text}>{content}</p>
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
          <form className={S.replyInputBox} onSubmit={handleSubmitReply}>
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

          {recentlyReply.map((item) => {
            return (
              <IsMineProvider writerProfileId={item.user_profile.profile_id}>
                <ThreadReplyComponent
                  key={item.reply_id}
                  reply={item}
                  userName={item.user_profile.user_base.nickname}
                  userImage={item.user_profile.profile_images}
                  onDelete={() => handleReplyDelete(item.reply_id)}
                />
              </IsMineProvider>
            );
          })}
        </div>
      )}
    </li>
  );
}
export default ThreadList;
