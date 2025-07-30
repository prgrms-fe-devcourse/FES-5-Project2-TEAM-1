import {  NavLink, Outlet, useParams } from 'react-router-dom';
import S from './StudyMemberChannel.module.css'
import supabase from '@/supabase/supabase';
import { useToast } from '@/utils/useToast';
import { useAuth } from '@/auth/AuthProvider';
import { useAdmin } from './context/useAdmin';



function StudyMemberChannel() {
  const { id } = useParams()
  const { success, error } = useToast()
  const{ profileId } = useAuth()
  const {isAdmin}= useAdmin()
 
  const handleJoin = async () => {
    const {data,error:fetchError } = await supabase.from('approve_member').select('status::text').match({
      'board_id': id,
      'profile_id': profileId
    }).maybeSingle()

    if (fetchError) console.error()

    switch (data?.status) {
      case '0': error('이미 가입신청을 요청하신 채널입니다');
        break
      case '1': error('가입 신청이 거절되셨습니다')
        break
      default: success("가입 신청을 요청하셨습니다");
    }
  
    const { error:memberError } = await supabase.from('approve_member').insert([{
      profile_id:profileId,
      board_id:id,
      status:0
    }])
    if(memberError) console.error()
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
    
  );
}
export default StudyMemberChannel