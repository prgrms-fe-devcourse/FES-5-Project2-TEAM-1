import S from './MypageTop.module.css'


function MypageDetails() {
  return (
    <div className={S.mypageDetailsContainer}>
        <ul>
            <li>
                <h3>주소</h3>
                <p>서울시 강남구 테헤란로 123</p>
            </li>
            <li>
                <h3>성별</h3>
                <p>여자</p>
            </li>
            <li>
                <h3>나이</h3>
                <p>900</p>
            </li>
        </ul>
    </div>
  )
}

export default MypageDetails
