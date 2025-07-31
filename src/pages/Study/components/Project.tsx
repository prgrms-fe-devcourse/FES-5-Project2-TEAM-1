import { useEffect, useState } from 'react';
import S from './Project.module.css'
import { useParams } from 'react-router-dom';
import supabase from '@/supabase/supabase';
import type { Tables } from '@/supabase/database.types';
import KakaoMap from './KakaoMap';



type Board = Tables<'board'>;
type PickBoard = Pick<Board,'member'|'board_cls'|'address'|'meeting_time'|'active'>;

function Project() {
  const {id:board_id} = useParams();
  const [projectData, setProjectData] = useState<PickBoard|null>(null);

  useEffect(()=>{
    const fetchProjectDetails = async() => {
      const {data, error} = await supabase
      .from('board')
      .select('member, board_cls, address, meeting_time, active')
      .eq('board_id',board_id)
      .single()
      .returns<PickBoard>();
      
      if(error) console.error('프로젝트 상세 정보 불러오기 실패 : ', error.message)
      setProjectData(data)
    }
    fetchProjectDetails();
  },[board_id])

  return (
    <>
      {
        projectData && (
          <div className={S.container}>
            <div className={S.cardInner}>
              {
                projectData.address 
                ? <KakaoMap address={projectData.address}/> 
                : <img src="/images/online.png" alt="online" />
              }
              <ul className={S.iconList}>
                <li className={S.list}>
                  {
                    projectData.address ? (
                      <>
                        <div className={S.icon}>
                          <img src="/icons/map-marker-line.svg" alt="" />
                        </div>
                        <p>{projectData.address}</p>
                      </>
                    ) : (
                      <>
                        <div className={S.icon}>
                          <img src="/icons/map-marker-line.svg" alt="" />
                        </div>
                        <p>온라인</p>
                      </>
                    )
                  }
                </li>
                <li className={S.list}>
                  <div className={S.icon}>
                    <img src="/icons/clock.svg" alt="" />
                  </div>
                  <p>{projectData.meeting_time ? projectData.meeting_time : '미정'}</p>
                </li>
                <li className={S.list}>
                  <div className={S.icon}>
                    <img src="/icons/channelmember.svg" alt="" />
                  </div>
                  <p>{projectData.member}명</p>
                </li>
              </ul>
            </div>
          </div>

        )
      }
    </>
  );
}
export default Project