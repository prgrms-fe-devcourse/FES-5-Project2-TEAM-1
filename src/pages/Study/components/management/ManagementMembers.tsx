import S from './ManagementMembers.module.css'

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




function ManagementMembers() {

  
  return (
    <main className={S.managementMembersContainer}>
      {
        dump && dump.map(({name, role , img},index)=>(
          <div className={S.card} key={index}>
            <img src={img} alt="프로필" />
            <div className={S.information}>
              <p className={S.name}>{name}</p>
              <p className={S.role}>{role}</p>
            </div>
            <button className={S.reject} type="button">내보내기</button>
            </div>
        ))
      }
    </main>
  )
}
export default ManagementMembers