import { useEffect, useRef, useState } from 'react'
import S from './Admin.module.css'
import supabase from '@/supabase/supabase'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'


type Approve = {
  id : string,
  name : string,
  certificateFile : string
}


function Admin() {
  const [ approveList, setApproveList] = useState<Approve[]>()
  const [ certificateFile, setCertificateFile] = useState<string|null>(null)
  const [ activeId, setActiveId ] = useState<string|null>(null);
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(()=>{
    const fetchApproveUser = async() => {
      const {data, error} = await supabase
        .from('user_base')
        .select('id, name')
        .eq('approve',false)
      if(error) console.error('승인 대기 목록 가져오기 실패')
      if(!data) return;
      
      const {data:certificateFile, error:certificateFileError} = await supabase
        .from('certification')
        .select('certification_id, image')
        .eq('approve',false)

      if(certificateFileError) console.error('수료증 가져오기 실패')
      if(!data) return;
      
      
      const result = await Promise.all(data.map( async(d)=> {
        const matchFile = certificateFile?.find(c=>c.image.split('.')[0] === d.id)
        if(!matchFile) {
          return {
            id:d.id,
            name:d.name,
            certificateFile:''
          }
        }
        const {data} = await supabase.storage
          .from('certificates')
          .getPublicUrl(matchFile.image);
        
        return {
          id: d.id,
          name: d.name,
          certificateFile : data.publicUrl
        }
      }))
      setApproveList(result)
      setActiveId(result[0].id)
      setCertificateFile(result[0].certificateFile)
    }
    fetchApproveUser();
  },[])

  
  const handleImageChange = (e:React.MouseEvent<HTMLButtonElement>) => {
    // e.target으로 했을때는 안됐는데 currentTarget으로 바꾸니까 잘 불러와진다
    const button = e.currentTarget as HTMLButtonElement
    const imgUrl = button.dataset.img
    const userId = button.dataset.id
    if(!imgUrl || !userId ){
      console.log('데이터 없음');
      return;
    }
    setCertificateFile(imgUrl)
    setActiveId(userId);
  }

  const updateApprove = async() => {
    const {error} = await supabase
      .from('user_base')
      .update({approve:true})
      .eq('id',activeId)
    if(error) console.error('회원 승인 실패');
    toast.success(`승인 완료!`,{ onClose() {
      navigate(`/admin`)
    },autoClose:1000})
    if(!approveList) return;

    const newApproveList = approveList.filter( data => data.id !== activeId);

    setApproveList(newApproveList);
    // 바로 approveList를 넣어줘서 setter는 비동기라 setCertificateFile과 setId에 아직 리스트 값이 바뀌지 않은채로 전달이 되기 때문에 승인해도 데이터가 남아있다
    setCertificateFile(newApproveList[0].certificateFile);
    setActiveId(newApproveList[0].id);
  }


  const list = approveList?.map(({name, id, certificateFile})=>(
    <button 
      key={id} 
      className={`${S.userInfoButton} ${id===activeId ? S.active : ''}`} 
      ref={buttonRef}
      onClick={handleImageChange} 
      data-img={certificateFile} 
      data-id={id}
    >
      <p className={S.name}>{name}</p>
    </button>
  )) 

  const handleBack = () => {
    navigate('/')
  }

  

  return (
    <div className={S.container}>
      <div className={S.header}>
        <h2 className={S.sectionHeader}>대기중인 요청</h2>
        <button className={S.backButton} onClick={handleBack}>
          <img src="/icons/back.svg"  alt="메인으로 돌아가기" />
          <p>메인으로 돌아가기</p>
        </button>
      </div>
      <div className={S.confirmList}>
        <div className={S.userList}>
          {list}
        </div>
        <div className={S.user}>
          {
            certificateFile && 
            <img className={S.image} src={certificateFile} alt="수료증"/>
          }
          <div className={S.buttonGroup}>
            <button className={S.acceptButton} type="button" onClick={()=>updateApprove()}>승인</button>
            <button className={S.rejectButton} type="button">거절</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Admin