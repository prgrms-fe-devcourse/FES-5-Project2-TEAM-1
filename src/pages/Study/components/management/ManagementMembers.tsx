import type { Tables } from '@/supabase/database.types';
import S from './ManagementMembers.module.css'
import { useEffect, useState } from 'react';
import supabase from '@/supabase/supabase';
import { useParams } from 'react-router-dom';
import { useToast } from '@/utils/useToast';

type User = Tables<"user_profile"> & {
  user_base: Tables<"user_base">;
};

function ManagementMembers() {

  const {success} = useToast()
  const {id} = useParams()
const [members, setMembers] = useState<User[]>([]);

useEffect(() => {
  const fetchData = async () => {
    const { data:profileData, error:profileError} = await supabase
      .from("approve_member")
      .select("profile_id").match({
        'board_id': id,
        'status':1
      })
    if (profileError) console.error();
    if (!profileData) return;
    const memberId = profileData.map(member => member.profile_id).filter(Boolean)

    const { data: memberData, error: memberError } = await supabase.from('user_profile').select('*,user_base(*)').in('profile_id',memberId)
    if(!memberData) return  
    if (memberError) console.error()
    setMembers(memberData)
  };
  fetchData();
}, [id]);

  const handleOut = async (profile_id:string) => {
    success('유저를 내보내셨습니다')
    const { error } = await supabase.from('approve_member').update({
      status:2
    }).match({
      profile_id,
      board_id:id
    })
    if (error) console.error()
    setMembers((prev) => prev.filter(user => user.profile_id !== profile_id))
  }
  return (
    <main className={S.managementMembersContainer}>
      {
        members && members.map(({ profile_id,profile_images,user_base})=>(
          <div className={S.card} key={profile_id}>
            <img src={profile_images} alt="프로필" />
            <div className={S.information}>
              <p className={S.name}>{user_base.name}</p>
              <p className={S.role}>{user_base.role}</p>
            </div>
            <button className={S.reject} type="submit" onClick={()=>handleOut(profile_id)}>내보내기</button>
            </div>
        ))
      }
    </main>
  )
}
export default ManagementMembers