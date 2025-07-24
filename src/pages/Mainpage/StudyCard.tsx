
import S from './StudyCard.module.css';

interface Props {
  title: string;
  contents: string;
  member: number;
  likes: number;
  status: string;
  due: string;
  tags: string[];
  tags_address:string;
}

function StudyCard({ title, contents, member, likes, status = '자유가입', due, tags, tags_address }: Props) {
  return (
    <div className={S.card}>
      <div className={S.top}>
        <div className={S.left}>
          <span className={S.badge}>{status}</span>
          <span className={S.due}> {due}</span>
        </div>
        <div className={S.svg}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" strokeOpacity="0.6" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>

            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" strokeOpacity="0.6" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
          </div>
      </div>

      <div className={S.body}>
        <h3 className={S.title}>{title}</h3>
        <p className={S.contents}>{contents}</p>
        

      </div>

      <div className={S.tags}>
        {tags.map((tag, idx) => (
          <span key={idx} className={S.tag}>
            #{tag}
          </span>
        ))}
        <span>{tags_address}</span>
        <span>{member}명</span>
      </div>

      </div>
  );
}
export default StudyCard;

