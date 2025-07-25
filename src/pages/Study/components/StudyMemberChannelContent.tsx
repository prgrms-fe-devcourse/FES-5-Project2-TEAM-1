import type { Tables } from '@/supabase/database.types';
import Cruitmember from './Cruitmember';
import StudyMember from './StudyMember';
import S from './StudyMemberChannelContent.module.css'
import { DdayCounter } from './utills/DdayCounter';
import { useLocation } from 'react-router-dom';


type Props = Tables<'channel'>
function StudyMemberChannelContent({channel_images,title,due_date,contents}:Props) {
  const dDay = DdayCounter(due_date)
  const location = useLocation()
  const card = location.state.card ?? {}

  return (
    <div className={S.layout}>
      <div className={S.infoTitleWrap}>
        <img src={channel_images} alt="" />
        <div className={S.infoTitleText}>
          <div className={S.infoTitle}>
            <h2>{title}</h2>
            <span className={S.dDayCounter}>
              D - 
              <span>{dDay[0]}</span>
              <span>{dDay[1] }</span>
            </span>
          </div>
          <ul className={S.infoList}>
            <li>카테고리</li>
            <li>카테고라</li>
            <li>카테고리</li>
            <li>카테고리</li>
          </ul>
        </div>
      </div>
      <article className={S.content}>
        {contents}
      </article>

      <article className={S.card}>
        <div className={S.cardHeader}>
          <p>프로젝트안내</p>
          <button type="button">프로젝트생성</button>
        </div>
        <Cruitmember {...card}  />
      </article>

      <article className={S.members}>
        <h3>스터디멤버</h3>
        <div className={S.memberList}>
          <StudyMember />
        </div>
      </article>
    </div>
  );
}
export default StudyMemberChannelContent;
