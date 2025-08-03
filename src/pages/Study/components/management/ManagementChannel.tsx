import React, { useEffect, useState } from 'react'
import S from './ManagementChannel.module.css'
import DaumPostcodeEmbed from 'react-daum-postcode'
import { useNavigate, useParams } from 'react-router-dom';
import type { Tables } from '@/supabase/database.types';
import supabase from '@/supabase/supabase';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Calender from '@/components/Calender';




type Board = Tables<'board'>;
type PickBoard = Pick<Board,'member'|'board_cls'|'address'|'meeting_time'|'active'>;

function MangementChannel() {
  const [category, setCategory] = useState<'0'|'1'|null>("0");
  const [meetingTime, setMeetingTime] = useState<string|null>(null);
  const [members, setMembers] = useState<number>(1);
  const [address, setAddress] = useState<string|null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [projectData, setProjectData] = useState<PickBoard | null>(null);
  const {id:board_id} = useParams();
  const navigate = useNavigate();
 

  // console.log('파라미터', board_id);

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

  useEffect(()=>{
    // console.log(projectData);
    if(!projectData) return;
    const { member, address, meeting_time, active } = projectData;
    
    setCategory('0');
    setMeetingTime(meeting_time);
    setMembers(member);
    setAddress(address);
    setIsOffline(address ? true : false);
    setIsActive(active);

  },[projectData])
  
  
  const handleCheckedOnline = () => {
    // address가 null일때
    // 얘를 클릭했을때
    return !isOffline ? true : false
  }

  const handleCheckedOffline = () => {
    // address가 있을때
    // 얘를 클릭했을때
    return isOffline ? true : false
  }


  const handleAddAdress = ({address}:{address:string}) => {
    setAddress(address);
    setIsOpen(false);
  }

  const addressStyle = {
    width: "555px",
    height: "500px",
    border: "2px solid rgba(153, 153, 153, 0.5)",
    marginTop: '0.2rem',
  }

  const handleUpButton = () => {
    setMembers(prev => prev+1)
  }

  const handleDownButton = () => {
    if(members === 1) return;
    setMembers(prev => prev-1)
  }

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if(isOffline && !address){
      toast.error('모임 장소를 선택해주세요',{autoClose:1500})
      return;
    }
    const convertAddress = address ? address : null

    const modifiedContents = {
      member: String(members),
      board_cls: category,
      meeting_time: meetingTime,
      address: convertAddress,
    }

    // console.log(modifiedContents);
    const updateProjectDetails = async() => {
      const {error} = await supabase
      .from('board')
      .update(modifiedContents)
        .eq('board_id', board_id)
      
       if (error) console.error(error);
    }
   
    updateProjectDetails();
    toast.success('저장되었습니다',{autoClose:1500})
  }

  const handleActive = (e:React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'active') {
     toast.success('채널이 활성화되었습니다.',{autoClose:1500}) 
      } else {
       toast.success('채널이 비활성화되었습니다.',{autoClose:1500});
      }
    setIsActive(prev => !prev)
  }

  useEffect(()=>{
    const updateActive = async() => {
      const {error} = await supabase
      .from('board')
      .update({active:isActive})
        .eq('board_id', board_id)  
      
      if(error) console.error(error)
    }
    updateActive();
  },[isActive])

  const handleDeleteChannel = () => {
    // 정말 삭제할것인지 여부 묻기
    // 삭제 진행
    Swal.fire({
      title:'정말 삭제하시겠습니까?',
      text: '채널의 데이터가 모두 삭제됩니다. 되돌릴 수 없습니다.',
      icon: 'warning',
      showCancelButton:true,
      confirmButtonText:'채널 삭제',
      cancelButtonText:'취소',
      confirmButtonColor:'#F00',
    }).then(result => {
      if(result.isConfirmed){
        const deleteChannel = async() => {
          const {error} = await supabase.from('board').delete().eq('board_id',board_id);

          if(error) {
            console.error('채널 삭제 실패 : ', error.message);
          }

          Swal.fire({
            title:'삭제가 완료되었습니다.', 
            text: '잠시후 메인으로 이동합니다', 
            icon: 'success',
            timer: 3000,
            timerProgressBar: true,
          })
          navigate('/');
        }
        deleteChannel();
      }
    })
  }


  return (
    <main className={S.mangementChannelContainer}>
      <h1 className={S.contentHeader}>프로젝트 생성</h1>
      <form className={S.projectDetailForm} onSubmit={handleSubmit}>
        <section className={S.category}>
          <h2 className={S.sectionHeader}>모집 타입</h2>
          <div className={S.categoryRadio}>
            <div className={S.study}>
              <input
                type="radio"
                name="category"
                id="study"
                defaultChecked
                onChange={() => setCategory("0")}
              />
              <label htmlFor="study">스터디</label>
            </div>
            <div className={S.project}>
              <input
                type="radio"
                name="category"
                id="project"
                onChange={() => setCategory("1")}
              />
              <label htmlFor="project">프로젝트</label>
            </div>
          </div>
        </section>

        <section className={S.deadline}>
          <h2 className={S.sectionHeader}>마감 기한</h2>

          <div className={S.calendarBox}>
            {category == "1" ? (
              <Calender
                isHidden={true}
                callBack={() => {}}
                shouldFetch={false}
              />
            ) : (
              <button
                type="button"
                className={
                  category === "0" || category === null
                    ? S.disableBtn
                    : S.calendarBtn
                }
              >
                날짜선택
              </button>
            )}
          </div>
        </section>

        <section className={S.time}>
          <h2 className={S.sectionHeader}>모임 시간</h2>
          <input
            type="text"
            name=""
            id=""
            value={meetingTime ? meetingTime : ""}
            placeholder="매주 월요일 저녁 9시"
            onChange={(e) => {
              setMeetingTime(e.target.value);
            }}
          />
        </section>

        <section className={S.contributors}>
          <h2 className={S.sectionHeader}>모집 인원</h2>
          <div className={S.countButton}>
            <button
              className={S.upButton}
              type="button"
              onClick={handleDownButton}
            >
              -
            </button>
            <div>{members}</div>
            <button
              className={S.downButton}
              type="button"
              onClick={handleUpButton}
            >
              +
            </button>
          </div>
        </section>

        <section className={S.location}>
          <h2 className={S.sectionHeader}>모임 장소</h2>
          <div className={S.locationRadio}>
            <div>
              <div className={S.online}>
                <input
                  type="radio"
                  name="location"
                  id="online"
                  checked={handleCheckedOnline()}
                  onChange={() => {
                    setIsOffline(false);
                    setAddress(null);
                  }}
                />
                <label htmlFor="online">온라인</label>
              </div>
              <div className={S.offline}>
                <input
                  type="radio"
                  name="location"
                  id="offline"
                  checked={handleCheckedOffline()}
                  onChange={() => {
                    setIsOffline(true);
                  }}
                />
                <label htmlFor="offline">오프라인</label>
              </div>
            </div>
            {isOffline && (
              <>
                <button
                  className={S.locationButton}
                  type="button"
                  onClick={() => {
                    setIsOpen((prev) => !prev);
                  }}
                >
                  {address ? (
                    <p className={S.address}>{address}</p>
                  ) : (
                    <p>Location</p>
                  )}
                </button>
                {isOpen && (
                  <DaumPostcodeEmbed
                    onComplete={handleAddAdress}
                    style={addressStyle}
                  />
                )}
              </>
            )}
          </div>
        </section>
        <button className={S.saveButton} type="submit">
          저장
        </button>
      </form>
      <hr className={S.hr} />
      <div className={S.controlSection}>
        <h1>채널관리</h1>
        <section className={S.activeGroup}>
          <h2 className={S.sectionHeader}>모집 활성화</h2>
          <section className={S.isActive}>
            <div className={S.active}>
              <input
                type="radio"
                name="isActive"
                id="active"
                defaultChecked
                onChange={handleActive}
              />
              <label htmlFor="active">활성화</label>
            </div>
            <div className={S.inactive}>
              <input
                type="radio"
                name="isActive"
                id="inactive"
                onChange={handleActive}
              />
              <label htmlFor="inactive">비활성화</label>
            </div>
          </section>
        </section>
        <section className={S.deleteSection}>
          <h2 className={S.sectionHeader}>채널 제거</h2>
          <button
            className={S.deleteButton}
            type="button"
            onClick={handleDeleteChannel}
          >
            채널 삭제하기
          </button>
        </section>
      </div>
    </main>
  );
}
export default MangementChannel