import { useState } from 'react'
import S from './ManagementChannel.module.css'
import DaumPostcodeEmbed from 'react-daum-postcode'

/**
 * 
 * 오프라인 선택 후 장소(address)가 값이 없다면 저장할때 확인 받기
 * form 태그 submit 할때 현재값들 데이터로 반환하면 될듯
 */


function MangementChannel() {

  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [address, setAddress] = useState<string|null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [category, setCategory] = useState<string>('study');
  const [contributors, setContributors] = useState<number>(1);

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
    setContributors(prev => prev+1)
  }

  const handleDownButton = () => {
    if(contributors === 1) return;
    setContributors(prev => prev-1)
  }

  return (
    <main className={S.mangementChannelContainer}>
      <h1 className={S.contentHeader}>프로젝트 생성</h1>
      <form>
        <h2>모집 타입</h2>
        <section className={S.category}>
            <div className={S.study}>
              <input type="radio" name="category" id="study" defaultChecked onChange={()=>setCategory('study')}/>
              <label htmlFor="study">스터디</label>
            </div>
            <div className={S.project}>
              <input type="radio" name="category" id="project" onChange={()=>setCategory('project')}/>
              <label htmlFor="project">프로젝트</label>
            </div>
        </section>

        <div className={S.dateContributors}>
          <section className={S.time}>
            <h2>모임 시간</h2>
            {/* <Calender/> */}
            <input type="text" name="" id="" placeholder='매주 월요일 저녁 9시'/>
          </section>

          <section className={S.contributors}>
            <h2>모집 인원</h2>
            <div className={S.countButton}>
              <button className={S.upButton} type="button" onClick={handleUpButton}>∧</button>
              <p>{contributors}</p>
              <button className={S.downButton} type="button" onClick={handleDownButton}>∨</button>
            </div>
          </section>
        </div>

        <h2>모임 장소</h2>
        <section className={S.location}>
          <div className={S.locationRadio}>
            <div className={S.online}>
              <input type="radio" name="location" id="online" defaultChecked onChange={()=>{setIsOffline(false)}}/>
              <label htmlFor="online">온라인</label>
            </div>
            <div className={S.offline}>
              <input type="radio" name="location" id="offline" onChange={()=>{setIsOffline(true)}}/>
              <label htmlFor="offline">오프라인</label>
            </div>
          </div>
          {
            isOffline && (
              <>
                <button className={S.locationButton} type="button" onClick={()=>{setIsOpen(prev => !prev)}}>
                  { address ? <p className={S.address}>{address}</p> : <p>Location</p>}
                </button>
                {
                  isOpen && (<DaumPostcodeEmbed onComplete={handleAddAdress} style={addressStyle}/>)
                }
              </>
            )
          }
        </section>

        <button className={S.saveButton} type="button">저장</button>
        <h2>모집 활성화</h2>
        <section className={S.isActive}>
          <div className={S.active}>
            <input type="radio" name="isActive" id="active" defaultChecked onChange={()=>{setIsActive(true)}}/>
            <label htmlFor="active">활성화</label>
          </div>
          <div className={S.inactive}>
            <input type="radio" name="isActive" id="inactive" onChange={()=>{setIsActive(false)}}/>
            <label htmlFor="inactive">비활성화</label>
          </div>
        </section>
      </form>

      <button className={S.deleteButton} type="button">채널삭제</button>
    </main>
  )
}
export default MangementChannel