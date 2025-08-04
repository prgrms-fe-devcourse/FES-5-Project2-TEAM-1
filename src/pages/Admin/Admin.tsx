import { Fragment, useEffect, useRef, useState } from 'react'
import S from './Admin.module.css'
import supabase from '@/supabase/supabase'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

/**
 * user_base 컬럼 중 대기중 상태만 불러오기
 * 수료증 파일 들고와야함
 *  - 확장자를 달리 받고있어서 어떻게?
 *  - 패턴 매칭으로 포함하는 id에 대해서 받으면 편할거 같은데 그런게 있는지 모르겠음
 *  - 아니면..
 * 가져온 수료증은 info에 아이디에 맞춰서 조합해줘야함
 * 데이터 패치
 * 승인 누르면 ture가 되도록
 * 가입한 사용자 목록에 admin은 안 뜨도록 해야할듯.
 * 
 * 유저 이메일과 같은 row 가져오기 (certification)
 * 
 * 승인하고나면 데이터 다시 렌더링 해줘야함
 * 사진을 확대해서 보거나 크게 볼수있게끔 해줘야할듯
 */

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
    console.log(activeId);
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

  

  return (
    <div className={S.container}>
      <h2 className={S.sectionHeader}>대기중인 요청</h2>
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