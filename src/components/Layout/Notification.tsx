
import S from './Notification.module.css'

function Notification() {



  return (
    <div className={S.container}>
      <div className={S.notification}>
        <button type="button" className={S.closeBtn}>
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
          <p>프로젝트 마감기한 이틀 남았습니다</p>
        </div>
      </div>
      <div>timestamp</div>
    </div>
  );
}
export default Notification