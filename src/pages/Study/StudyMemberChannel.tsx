import {  NavLink, Outlet, useParams } from 'react-router-dom';
import S from './StudyMemberChannel.module.css'
import supabase from '@/supabase/supabase';
import { useToast } from '@/utils/useToast';
import { useEffect, useState } from 'react';
import type { Tables } from '@/supabase/database.types';


type User = Tables<'approve_member'>

function StudyMemberChannel() {
  const { id } = useParams()
  const { success } = useToast()
  const [userData, setUserData] = useState<User[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('approve_member').select('*')
      if (error) console.log(error.message)
      if(!data) return
      setUserData(data)
    }
    fetchData()
  },[id])

  const profileId = userData.find(user => user.profile_id !== null)
  const findProfileId = profileId?.profile_id ?? "";
  
  const handleJoin = async (profileId: string) => {
    if(!profileId) return
    success('가입 신청을 요청하셨습니다')
    const { error } = await supabase.from('approve_member').insert([{
      profile_id:profileId,
      board_id:id,
      status:0
    }])
    if(error) console.error()
  }

  return (
    <main className={S.container}>
      <nav className={S.header}>
        <div className={S.headerinner}>
          <NavLink
            to="."
            end
            className={({ isActive }) => (isActive ? S.active : "")}
          >
            홈
          </NavLink>
          <NavLink
            to="thread"
            className={({ isActive }) => (isActive ? S.active : "")}
          >
            스레드
          </NavLink>
          <NavLink
            to="management"
            className={({ isActive }) => (isActive ? S.active : "")}
          >
            관리
          </NavLink>
        </div>
        <button className={S.joinBtn} type="submit" onClick={()=>handleJoin(findProfileId)}>가입하기</button>
      </nav>

      <Outlet />
    </main>
  );
}
export default StudyMemberChannel