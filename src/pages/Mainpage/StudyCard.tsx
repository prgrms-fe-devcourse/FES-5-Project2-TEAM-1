
import S from './StudyCard.module.css';

interface Props {
  title: string;
  contents: string;
  member: number;
  likes: number;
  status: string;
  due: string;
  tags: string[];
}

function StudyCard({ title, contents, member, likes, status = '자유가입', due, tags }: Props) {
  return (
    <div className={S.card}>
      <div className={S.top}>
        <span className={S.badge}>{status}</span>
        <span className={S.due}>모집 마감 {due}</span>
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
        <span>{member}명</span>
      </div>

      </div>
  );
}
export default StudyCard;