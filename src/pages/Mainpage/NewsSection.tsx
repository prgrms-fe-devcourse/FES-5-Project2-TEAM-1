
import S from "./NewsSection.module.css"

const newsList = [
  {
    id: 1,
    title:'프론트엔드 데브코스 후기',
    description: '스스로 고민하고 반복해서\n 도전하며 진짜 실력을 쌓았어요\n 프론트엔드 데브코스 후기 ✍',
    image: '/images/카드1.png',
    url:'https://www.instagram.com/programmers_official/p/DKG75jxzwIX/',
  },
  {
    id: 2,
    title:'개발자의 첫 1년',
    description: '개발자의 첫 1년:\n 신입의 생존 가이드\n 이걸 보고 시작하세요! 🧭',
    image: '/images/카드2.png',
    url:'https://www.instagram.com/programmers_official/p/DHj8htzz53a/',
  },
  {
    id: 3,
    title:'나는 어떤 개발자인가?',
    description: '나는 어떤 개발자인가?\n MBTIx개발자 EVENT\n 유형별 밈과 참여 이벤트 🥳',
    image: '/images/카드3.png',
    url:'https://www.instagram.com/programmers_official/p/DMEaw_PzBCr/',
  },
];

function NewsSection() {
  return (
    <section className={S.section}>
        <h2>새 소식</h2>
        <hr />
        <div className={S.cardList}>
      {newsList.map((item) => (
        <div key={item.id} className={S.card}>
          <div className={S.cardContent}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <img src={item.image} alt={item.title} />
            </a>
            <div className={S.content}>
          </div>
          <p className={S.p}>
            {item.description.split('\n').map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </p>
          </div>
        </div>
      ))}
      </div>
    </section>
  );
}
export default NewsSection