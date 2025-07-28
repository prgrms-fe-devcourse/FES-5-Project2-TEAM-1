import supabase from '@/supabase/supabase';
import S from './Thread.module.css'
import ThreadList from './ThreadList';
import { useEffect, useRef, useState } from 'react';
import type { Tables } from '@/supabase/database.types';


type Thread = Tables<'thread'>
function Thread() {

 const [data,setData] = useState<Thread[]>([])
const inputRef = useRef<HTMLInputElement|null>(null)
  useEffect(() => {
     const threadData = async () => {
       const { data, error } = await supabase.from("thread").select("*");
       if (error) console.error();
       if (!data) return 
       setData(data);
    }; 
    threadData()
  }, [])
  
  const handleInputbarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement
    if (target.closest('button')) return 
    inputRef.current?.focus()
  }

  return (
    <div className={S.layout}>
      <div className={S.writerBox}>
        <div className={S.profile}>
          <img src="/images/너굴.png" alt="" />
          <p>이름</p>
        </div>
        <div className={S.inputContent} onClick={handleInputbarClick}>
          <div className={S.partition}></div>
          <input
            type="text"
            ref={inputRef}
            placeholder="내용을 입력해 주세요"
          />
        </div>
        <div className={S.confirmBtnWrap}>
          <button type="submit" className={S.confirm}>
            등록
          </button>
        </div>
      </div>
      <ul className={S.threads}>
        {data.map((list) => (
          <ThreadList data={list} key={list.thread_id} />
        ))}
      </ul>
    </div>
  );
}
export default Thread