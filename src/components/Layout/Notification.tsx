import S from './Notification.module.css'
import type { Tables } from '@/supabase/database.types';
import { commentTime } from '@/pages/Study/components/utills/commentTime';

import { useNotification } from '../context/useNotification';


type Notification = Tables<'notification'>

function Notification() {

 const {alarms,deleteAlarm} = useNotification()
  
  
  if (alarms.length == 0) return null;
  const sortedAlarm = [...alarms].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  
  
  return (
      <>
      {
        sortedAlarm && sortedAlarm.map(({id,content,created_at}) => {
          return (
            <div className={S.container} key={id}>
              <div className={S.notification}>
                <button type="button" className={S.closeBtn} onClick={()=>deleteAlarm(id)}>
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

