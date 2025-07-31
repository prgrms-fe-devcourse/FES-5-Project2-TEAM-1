
import { useEffect, useState } from 'react';
import S from './Notification.module.css'
import supabase from '@/supabase/supabase';
import type { Tables } from '@/supabase/database.types';
import { commentTime } from '@/pages/Study/components/utills/commentTime';
import { useToast } from '@/utils/useToast';


type Notification = Tables<'notification'>

function Notification({ profileId }: {profileId:string|null}) {
  const {success} = useToast()
  const [alarms,setAlarms] = useState<Notification[]>([])
  useEffect(() => {
   
    const fetchData = async () => {
       const {data ,error} =  await supabase.from('notification').select('*').eq('user_profile_id',profileId)
      if (error) console.error("❌ fetch error:", error);
      if (!data) return
      setAlarms(data)
    }
     fetchData()
  }, [profileId])

  useEffect(() => {
    if (!profileId) return;
    const channel = supabase
      .channel("notify-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notification",
          filter: `user_profile_id=eq.${profileId}`,
        },
        (payload) => {
          console.log("알림 도착:", payload.new);
          
             if (payload.new.user_profile_id !== profileId) {
               console.log("⛔ 수신된 알림은 내 것이 아님. 무시");
               return;
          }
          
          setAlarms((prev) => [...prev, payload.new as Notification])
          success('알림이 도착하였습니다')
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId]);
  
  const handleDelete = async (targetId:string) => {
    setAlarms(prev => prev.filter(n => n.id !== targetId))
    const { error } = await supabase.from('notification').delete().eq('id',targetId)
    if(error) console.error(error)
  }
  
  const sortedAlarm = [...alarms].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  if (alarms.length == 0) return null
  
  return (
      <>
      {
        sortedAlarm && sortedAlarm.map(({id,content,created_at}) => {
          return (
            <div className={S.container} key={id}>
              <div className={S.notification}>
                <button type="button" className={S.closeBtn} onClick={()=>handleDelete(id)}>
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.119629"
                      y="0.807129"
                      width="24"
                      height="24"
                      rx="4"
                      fill="currentColor"
                      fillOpacity="0.5"
                    />
                    <path
                      d="M7.14778 15.9395L10.28 12.8072L7.14778 9.67497L8.98737 7.83539L12.1196 10.9676L15.2519 7.83539L17.0749 9.6584L13.9426 12.7907L17.0915 15.9395L15.2519 17.7791L12.1031 14.6302L8.97079 17.7625L7.14778 15.9395Z"
                      fill="white"
                    />
                  </svg>
                </button>
                <div className={S.notificationText}>
                  <h5>새로운 알림이 도착했습니다</h5>
                  <p>{content}</p>
                </div>
              </div>
              <div>{commentTime(created_at)}</div>
            </div>
          );
      })
    }
    </>

  );
}
export default Notification

