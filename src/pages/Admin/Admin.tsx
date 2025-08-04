import { useEffect, useState } from 'react'
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
  const navigate = useNavigate();

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
    }
    fetchApproveUser();

  },[])


  const updateApprove = async(id:string) => {
    const {error} = await supabase
    .from('user_base')
    .update({approve:true})
    .eq('id',id)
    if(error) console.error('회원 승인 실패');
    toast.success(`승인 완료!`,{ onClose() {
      navigate(`/admin`)
    },autoClose:1000})
  }

  

  return (
    <div className={S.container}>
      <h2 className={S.sectionHeader}>대기중인 요청</h2>
      <ul className = {S.userList}>
        {
          approveList && approveList.map(({name, id, certificateFile}) => (
            <li className = {S.user} key={id}>
              <div className={S.userInfo}>
                <p className={S.name}>{name}</p>
                <img className={S.image} src={certificateFile} alt="수료증" />
              </div>
              <div className={S.buttonGroup}>
                <button className={S.acceptButton} type="button" onClick={()=>updateApprove(id)}>승인</button>
                <button className={S.rejectButton} type="button">거절</button>
              </div>
            </li>

          ))
        }
      </ul>
    </div>
  )
}
export default Admin