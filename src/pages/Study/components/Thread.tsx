import supabase from "@/supabase/supabase";
import S from "./Thread.module.css";
import ThreadList from "./ThreadList";
import { useEffect, useRef, useState } from "react";
import type { Tables } from "@/supabase/database.types";
import { useParams } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { IsMineProvider } from "@/components/context/isMine";

type ThreadWithUser = Tables<"thread"> & {
  user_profile: Tables<"user_profile"> & {
    user_base: Tables<"user_base">;
  };
};

type Thread = Tables<"thread">;
type Member = Tables<'approve_member'> & {
  user_profile : Tables<"user_profile" > & {
  user_base: Tables<"user_base">;
};}

type User = Tables<'user_profile'> & {
  user_base : Tables<'user_base'>
}
type ReplyWithUser = ThreadReply & {
  user_profile: User;
};

type ThreadReply = Tables<"thread_reply">;

function Thread() {
  const { profileId } = useAuth();

  const { id } = useParams();
  const [threadData, setThreadData] = useState<ThreadWithUser[]>([]);
  const [updateContent, setUpdateContent] = useState("");
  const [member, setMember] = useState<Member[]>([]);
  const [currentUser, setCurrentUser] = useState<User[]>([]);
  const [replyData, setReplyData] = useState<Record<string, ReplyWithUser[]>>(
    {}
  );
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!id) throw new Error("id가 없습니다");
    if (!profileId) return;
    const fetchData = async () => {
      const [{ data: ThreadData, error: ThreadError }, { data: user }] =
        await Promise.all([
          supabase
            .from("thread")
            .select("*,user_profile(*,user_base(*))")
            .eq("board_id", id),
          supabase
            .from("user_profile")
            .select("*,user_base(*)")
            .in("profile_id", [profileId]),
        ]);
      if (ThreadError) throw new Error("데이터가 들어오지 않아요");
      setThreadData(ThreadData as ThreadWithUser[]);
      if (!user) return;
      setCurrentUser(user);
    };
    fetchData();
  }, [id, profileId]);

  const targetThread = threadData.find((thread) => thread.board_id == id);
  const board_id = targetThread?.board_id;

  useEffect(() => {
    if (!board_id) return;
    const getUserJoinData = async (board_id: string) => {
      const { data } = await supabase
        .from("thread")
        .select("*,user_profile(*,user_base(*))")
        .eq("board_id", board_id);
      setThreadData(data as ThreadWithUser[]);
    };
    const channel = supabase
      .channel("notify-thread")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "thread",
          filter: `board_id=eq.${board_id}`,
        },
        (payload) => {
          console.log("알림 도착:", payload.new);
          // 여기서 토스트 보여주거나 상태 업데이트
          getUserJoinData(payload.new.board_id);
        }
      )

      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [board_id]);

  useEffect(() => {
    const channel = supabase
      .channel("notify-thread_reply")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "thread_reply",
        },
        (payload) => {
          const thread_id = payload.new.thread_id;
          setThreadReplyData(thread_id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const fetchInitialReplies = async () => {
      const replies = await Promise.all(
        threadData.map(async (thread) => {
          const { data } = await supabase
            .from("thread_reply")
            .select("*,user_profile(*,user_base(*))")
            .eq("thread_id", thread.thread_id);
          return [thread.thread_id, data || []] as [string, ReplyWithUser[]];
        })
      );
      const replyMap = Object.fromEntries(replies);
      setReplyData(replyMap);
    };

    if (threadData.length > 0) {
      fetchInitialReplies();
    }
  }, [threadData]);

  useEffect(() => {
    const recentlyUser = async () => {
      const { data, error } = await supabase
        .from("approve_member")
        .select("*,user_profile(*,user_base(*))")
        .match({
          board_id: id,
          status:'1'
        })

      if (!data) return;
      if (error) console.error();
      setMember(data);
    };
    recentlyUser();
  }, [id]);

  const handleInputbarClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    inputRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!updateContent.trim()) return;

    const { error } = await supabase.from("thread").insert([
      {
        board_id: id,
        profile_id: profileId,
        contents: updateContent,
        likes: 0,
        create_at: new Date(),
      },
    ]);
    if (error) console.log(error.message);
    if(!error) setUpdateContent("");
    const { data } = await supabase
      .from("thread")
      .select("*,user_profile(*,user_base(*))")
      .eq("board_id", id);
    if (data) setThreadData(data);
  };

  const handleDelete = (targetId: string) => {
    setThreadData(threadData.filter((item) => item.thread_id !== targetId));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!updateContent.trim()) return;
      handleSubmit();
    }
  };
  // 개별 쓰레드에 맞는 댓글만 업데이트
  const setThreadReplyData = async (thread_id: string) => {
    const { data, error } = await supabase
      .from("thread_reply")
      .select("*,user_profile(*,user_base(*))")
      .eq("thread_id", thread_id);

    if (error) {
      console.error(error.message);
      return;
    }

    setReplyData((prev) => ({
      ...prev,
      [thread_id]: data as ReplyWithUser[],
    }));
  };

  const recentlyThread = [...threadData].sort((a, b) => {
    const timeDiff =
      new Date(b.create_at).getTime() - new Date(a.create_at).getTime();
    if (timeDiff !== 0) return timeDiff;

  return b.thread_id.localeCompare(a.thread_id);
});

  return (
    <>
      <div className={S.layout}>
        <div className={S.container}>
          <div className={S.writerBox}>
            <div className={S.profile}>
              {currentUser.map(({ profile_id, profile_images, user_base }) => (
                <span className={S.profile} key={profile_id}>
                  <img src={profile_images} alt="" />
                  <p>{user_base.nickname}</p>
                </span>
              ))}
            </div>
            <div className={S.inputContent} onClick={handleInputbarClick}>
              <div className={S.partition}></div>
              <textarea
                ref={inputRef}
                value={updateContent}
                placeholder="내용을 입력해 주세요"
                onChange={(e) => setUpdateContent(e.target.value)}
                onKeyDown={handleKeyDown}
              ></textarea>
            </div>
            <div className={S.confirmBtnWrap}>
              <button
                type="submit"
                className={S.confirm}
                onClick={handleSubmit}
              >
                등록
              </button>
            </div>
          </div>
          <ul className={S.threads}>
            {recentlyThread.map((reply) => {
              return (
                <IsMineProvider key={reply.thread_id} writerProfileId={reply.user_profile.profile_id}>
                <ThreadList
                  key={reply.thread_id}
                  data={reply}
                  replyData={replyData[reply.thread_id] || []}
                  userName={reply.user_profile?.user_base.nickname}
                  userImage={reply.user_profile?.profile_images}
                  onDelete={() => handleDelete(reply.thread_id)}
                  />
                </IsMineProvider>
              );
            })}
          </ul>
        </div>
        <div className={S.member}>
          <div className={S.recentlyUserTitle}>Channel Member</div>
          <ul className={S.recentlyProfileWrap}>
            {member.map((user) => {
              return (
                <li key={user.board_id}>
                  <div className={S.recentlyProfile}>
                    <img src={user.user_profile?.profile_images} alt="유저 프로필 이미지" />
                    <p>{user.user_profile.user_base.nickname}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
export default Thread;
