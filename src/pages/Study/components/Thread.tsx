import supabase from '@/supabase/supabase';
import S from './Thread.module.css'
import ThreadList from './ThreadList';
import { useEffect, useRef, useState } from 'react';
import type { Tables } from '@/supabase/database.types';
import { useParams } from 'react-router-dom';



type Thread = Tables<'thread'>


function Thread() {

  const { id } = useParams()
  const [threadData, setThreadData] = useState<Thread[]>([])
  const [updateContent, setUpdateContent] = useState('')
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
 
  useEffect(() => {
    if (!id) throw new Error('id가 없습니다')
    const fetchData = async () => {
      const { data, error } = await supabase.from("thread").select("*").eq('board_id', id)
      if (error) throw new Error('데이터가 들어오지 않아요')
      setThreadData(data as Thread[]);
    };
    fetchData()
  }, [id])
 


  if (!threadData) return
  const targetThread = threadData.find(thread => thread.board_id == id)
  const board_id = targetThread?.board_id
  const profile_id = targetThread?.profile_id
  
  const handleInputbarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement
    if (target.closest('button')) return 
    inputRef.current?.focus()
  }

  
  const handleSubmit = async() => { 
    const {error} =  await supabase.from('thread').insert([{
      board_id,
      profile_id,
      contents:updateContent,
      likes: 0,
      create_at:new Date()
    }])
    if (error) console.log(error.message)
    setUpdateContent("");
    const { data } = await supabase.from('thread').select('*').eq('board_id', board_id)
    if (data) setThreadData(data)
  }

  const handleDelete = (targetId:string) => {
    setThreadData(threadData.filter(item => item.thread_id !== targetId))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    if (e.key === 'Enter' && !e.shiftKey) {
    if(!updateContent.trim()) return
      handleSubmit()
    }
  }

  const recentlyThread = [...threadData].sort((a, b) => (
    new Date(b.create_at).getTime() - new Date(a.create_at).getTime()
  ))

  return (
    <div className={S.layout}>
      <div className={S.writerBox}>
        <div className={S.profile}>
          <img src="/images/너굴.png" alt="" />
          <p>이름</p>
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
          <button type="submit" className={S.confirm} onClick={handleSubmit}>
            등록
          </button>
        </div>
      </div>
      <ul className={S.threads}>
        {recentlyThread && recentlyThread.map((reply) => (
          <ThreadList data={reply} key={reply.thread_id} onDelete={()=>handleDelete(reply.thread_id)}/>
        ))}
      </ul>
    </div>
  );
}
export default Thread