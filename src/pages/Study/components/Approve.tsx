import S from './Approve.module.css'

type Dump = {
  name:string,
  role:string,
  img:string,
}

const dump:Dump[] = [
  {
    name:'이름1',
    role:'프론트엔드',
    img:'/src/assets/github.svg',
  },
  {
    name:'이름2',
    role:'프론트엔드',
    img:'/src/assets/github.svg',

  },
  {
    name:'이름3',
    role:'백엔드',
    img:'/src/assets/github.svg',

  },
  {
    name:'이름4',
    role:'백엔드',
    img:'/src/assets/github.svg',

  },
  {
    name:'이름1',
    role:'데이터',
    img:'/src/assets/github.svg',

  },
  {
    name:'이름1',
    role:'데이터',
    img:'/src/assets/github.svg',

  },
  {
    name:'이름1',
    role:'풀스택',
    img:'/src/assets/github.svg',

  },
]



function Approve() {
  return (
    <main>
      {
        dump && dump.map(({name, role, img},index)=>(
          <div className={S.card} key={index}>
            <img src={img} alt="프로필" />
            <div className={S.information}>
              <p className={S.name}>{name}</p>
              <p className={S.role}>{role}</p>
            </div>
            <div className={S.buttonGroup}>
              <button className={S.accept} type="button">승인</button>
              <button className={S.decline} type="button">거절</button>
            </div>
          </div>
        ))
      }
    </main>
  )
}
export default Approve