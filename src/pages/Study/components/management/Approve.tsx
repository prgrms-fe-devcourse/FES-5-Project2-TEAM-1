import { useEffect, useState } from 'react'
import S from './Approve.module.css'
import supabase from '@/supabase/supabase'

import { useParams } from 'react-router-dom'
import type { Tables } from '@/supabase/database.types'
import { useToast } from '@/utils/useToast'





type User = Tables<"user_profile"> & {
    user_base: Tables<"user_base">;
  };

function Approve() {

  const { success, error } = useToast()

  const { id } = useParams()
  const [pendingMember,setPendingMember] = useState<User[]>([])

  useEffect(() => { 
    const fetchData = async () => {
      const { data: profileData, error: profileError } = await supabase.from('approve_member').select('profile_id').match({
        'board_id': id,
        'status':0
      })
      if (profileError) console.error();
      if(!profileData) return 
      const pendingId = profileData.map(member => member.profile_id).filter(Boolean)

      const { data:users, error:userError } = await supabase.from('user_profile').select('*,user_base(*)').in('profile_id', pendingId)
      if (userError) console.log(userError)
      if(!users) return
      setPendingMember(users);
    }
    fetchData()
  }, [id])

  const handleApprove = async (profile_id: string) => {
    success("채널가입을 승인하였습니다.");
    const { error } = await supabase.from('approve_member').update({
      status:1
    }).match({
      profile_id,
      board_id:id
    })
    
    if (error) console.error()
    setPendingMember(prev => prev.filter(user => user.profile_id !== profile_id))
  }
  
  const handleReject = async (profile_id: string) => {
     error("채널가입을 거절하였습니다");
       const {error:rejectError } = await supabase
         .from("approve_member")
         .update({
           status: 2,
         })
         .match({
           profile_id,
           board_id:id
         })
  
    if (rejectError) console.error();
    setPendingMember((prev) =>
      prev.filter((user) => user.profile_id !== profile_id)
    );

  }

  return (
    <main className={S.approveContainer}>
      {
        pendingMember && pendingMember.map(({profile_id,profile_images,user_base})=>(
          <div className={S.card} key={profile_id}>
            <img src={profile_images} alt="프로필" />
            <div className={S.information}>
              <p className={S.name}>{user_base.name}</p>
              <p className={S.role}>{user_base.role}</p>
            </div>
            <div className={S.buttonGroup}>
              <button className={S.accept} type="submit" onClick={()=>handleApprove(profile_id)}>승인</button>
              <button className={S.decline} type="submit" onClick={()=>handleReject(profile_id)}>거절</button>
            </div>
          </div>
        ))
      }
    </main>
  )
}
export default Approve