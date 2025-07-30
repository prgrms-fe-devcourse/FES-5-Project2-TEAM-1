import {  NavLink, Outlet, useParams } from 'react-router-dom';
import S from './StudyMemberChannel.module.css'
import supabase from '@/supabase/supabase';
import { useToast } from '@/utils/useToast';
import { useEffect, useState } from 'react';
import type { Tables } from '@/supabase/database.types';
import { useAuth } from '@/auth/AuthProvider';
import { AdminProvider } from '@/components/context/useAdmin';


type User = Tables<'approve_member'>

function StudyMemberChannel() {
  const { id } = useParams()
  const { user:currentUser} = useAuth()
  const { success,error } = useToast()
  const [userData, setUserData] = useState<User[]>([])
  const [userProfile, setUserProfile] = useState<string>('')
  const [adminId,setAdminId] = useState<string|null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if(!currentUser) return
      const { data, error } = await supabase.from('user_profile').select('profile_id').eq('user_id', currentUser.id).single()
      setUserProfile(data?.profile_id)
      if(error) console.error()
    }
    fetchProfile()
  },[currentUser])

  useEffect(() => {
    const fetchAdmin = async () => {
      const { data,error } = await supabase.from('board').select('profile_id').eq('board_id',id).single()
      setAdminId(data?.profile_id)
      if(error) console.error()
    }
    fetchAdmin()
  },[])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('approve_member').select('*')
      if (error) console.log(error.message)
      if(!data) return
      setUserData(data)
    }
    fetchData()
  },[id])

  const handleJoin = async () => {
   
      const isJoin = userData.find(
        (user) => user.profile_id === userProfile && user.board_id === id
      );

    switch (isJoin?.status) {
      case '0': error('이미 가입신청을 요청하신 채널입니다');
        break
      case '1' : error('가입 신청이 거절되셨습니다')
      break
      default: success("가입 신청을 요청하셨습니다");
    }
    
    const { error:memberError } = await supabase.from('approve_member').insert([{
      profile_id:userProfile,
      board_id:id,
      status:0
    }])
    if(memberError) console.error()
  }
  const isAdmin = userProfile === adminId

  return (
    <AdminProvider>
      {" "}
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
            {isAdmin && (
              <NavLink
                to="management"
                className={({ isActive }) => (isActive ? S.active : "")}
              >
                관리
              </NavLink>
            )}
          </div>
          {!isAdmin && (
            <button className={S.joinBtn} type="submit" onClick={handleJoin}>
              가입하기
            </button>
          )}
        </nav>

        <Outlet />
      </main>
    </AdminProvider>
  );
}
export default StudyMemberChannel