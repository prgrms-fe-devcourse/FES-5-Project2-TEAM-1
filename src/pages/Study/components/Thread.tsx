import supabase from '@/supabase/supabase';
import S from './Thread.module.css'
import ThreadList from './ThreadList';
import { useEffect, useRef, useState } from 'react';
import type { Tables } from '@/supabase/database.types';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';


type ThreadWithUser = Tables<"thread"> & {
  user_profile: Tables<"user_profile"> & {
    user_base: Tables<"user_base">;
  };
};

type Thread = Tables<'thread'>
type User = Tables<'user_profile'> & {
  user_base:Tables<'user_base'>
}

function Thread() {
  const {profileId} = useAuth()
  const profile_id = profileId;

  
  const { id } = useParams()
  const [threadData, setThreadData] = useState<ThreadWithUser[]>([])
  const [updateContent, setUpdateContent] = useState('')
  const [recentlyUser, setRecentlyUser] = useState<User[]>([])
  const [currentUser,setCurrentUser] = useState<User[]>([])
  const inputRef = useRef<HTMLTextAreaElement | null>(null)


  useEffect(() => {
    if (!id) throw new Error('id가 없습니다')
    if(!profileId) return 
    const fetchData = async () => {
      const [{ data: ThreadData ,error:ThreadError}, { data: user }] = await Promise.all([
         supabase.from("thread").select("*,user_profile(*,user_base(*))").eq("board_id", id),
         supabase.from('user_profile').select('*,user_base(*)').in('profile_id',[profileId])
      ]); 
      if (ThreadError) throw new Error('데이터가 들어오지 않아요')
      setThreadData(ThreadData as ThreadWithUser[]);
      if(!user) return 
      setCurrentUser(user)
    };
    fetchData()
  }, [id,profileId])


  const targetThread = threadData.find(thread => thread.board_id == id)
  const board_id = targetThread?.board_id

  
  useEffect(() => {
    const profileId = threadData
      .map((t) => t.profile_id)
      .filter((id): id is string => typeof id === "string")

    const recentlyUser = async () => {
      const { data,error } = await supabase
        .from("user_profile")
        .select("*,user_base(*)")
        .in("profile_id", profileId);
    
      if (!data) return;
      if(error) console.error()
      const users = data as User[];

   const sorted = users
     .filter((u) => u.user_base?.recent_at) 
     .sort(
       (a, b) =>
         new Date(b.user_base.recent_at!).getTime() -
         new Date(a.user_base.recent_at!).getTime()
     );
      if (!sorted) return;
      setRecentlyUser(sorted);
    };
    recentlyUser();
  }, [threadData]);


  const handleInputbarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement
    if (target.closest('button')) return 
    inputRef.current?.focus()
  }

  
  const handleSubmit = async () => { 
    if (!updateContent.trim()) return;
    
    const {error} =  await supabase.from('thread').insert([{
      board_id:id,
      profile_id,
      contents:updateContent,
      likes: 0,
      create_at:new Date()
    }])
    if (error) console.log(error.message)
    setUpdateContent("");
    const { data } = await supabase.from('thread').select('*,user_profile(*,user_base(*))').eq('board_id', board_id)
    if (data) setThreadData(data)
  }
  
  const handleDelete = (targetId:string) => {
    setThreadData(threadData.filter(item => item.thread_id !== targetId))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
    if(!updateContent.trim()) return
      handleSubmit()
    }
  }

  const recentlyThread = [...threadData].sort((a, b) => (
    new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
  ))

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
            {recentlyThread.map((reply) => 
                <ThreadList
                  key={reply.thread_id}
                  data={reply}
                  userName={reply.user_profile?.user_base.nickname}
                  userImage={
                    reply.user_profile?.profile_images
                  }
                  onDelete={() => handleDelete(reply.thread_id)}
                />
            )}
          </ul>
        </div>
        <div className={S.member}>
          <div className={S.recentlyUserTitle}>최근 접속한 사용자</div>
          <ul className={S.recentlyProfileWrap}>
            {recentlyUser.map((user) => {
              return (
                <li key={user.user_id}>
                  <div className={S.recentlyProfile}>
                    <img src={user.profile_images} alt="" />
                    <p>{user.user_base.nickname}</p>
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
export default Thread