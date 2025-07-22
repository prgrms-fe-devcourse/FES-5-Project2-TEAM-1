
import StudyCard from './StudyCard';
import S from './StudyCardList.module.css';

const dummyData = [
  {
    id: 1,
    title: '프론트엔드 스터디 모집',
    contents: 'React, Typescript 공부하는 팀원 구해요!',
    member: 5,
    likes: 12,
    status: '자유가입',
    due: 'D - 3',
    tags: ['React', 'TS', '서울'],
  },
  {
    id: 2,
    title: '프론트엔드 스터디 모집',
    contents: 'React, Typescript 공부하는 팀원 구해요!',
    member: 3,
    likes: 8,
    status: '자유가입',
    due: 'D - 3',
    tags: ['React', 'TS', '서울'],
  },
  {
    id: 3,
    title: '프론트엔드 스터디 모집',
    contents: 'React, Typescript 공부하는 팀원 구해요!',
    member: 4,
    likes: 6,
    status: '자유가입',
    due: 'D - 3',
    tags: ['React', 'TS', '서울'],
  },
    {
    id: 4,
    title: '프론트엔드 스터디 모집',
    contents: 'React, Typescript 공부하는 팀원 구해요!',
    member: 5,
    likes: 12,
    status: '자유가입',
    due: 'D - 3',
    tags: ['React', 'TS', '서울'],
  },
  {
    id: 5,
    title: '프론트엔드 스터디 모집',
    contents: 'React, Typescript 공부하는 팀원 구해요!',
    member: 3,
    likes: 8,
    status: '자유가입',
    due: 'D - 3',
    tags: ['React', 'TS', '서울'],
  },
  {
    id: 6,
    title: '프론트엔드 스터디 모집',
    contents: 'React, Typescript 공부하는 팀원 구해요!',
    member: 4,
    likes: 6,
    status: '자유가입',
    due: 'D - 3',
    tags: ['React', 'TS', '서울'],
  },
  
];

function StudyCardList() {
  return (
    <section className={S.list}>
      {dummyData.map((card) => (
        <StudyCard key={card.id} {...card} />
      ))}
    </section>
  );
}

export default StudyCardList;
