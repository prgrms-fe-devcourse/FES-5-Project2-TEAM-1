import S from './DeleteAccount.module.css'
interface Props {
  profileId : string;
}


function DeleteAccount({profileId}:Props) {
// 계정 삭제 이벤트 핸들러
// 데이터를 싹다 날리고 계정 삭제해야함
// 진짜 삭제할건지 여부 묻기

  return (
    <button className={S.deleteAccount} type="button">회원탈퇴</button>
  )
}
export default DeleteAccount