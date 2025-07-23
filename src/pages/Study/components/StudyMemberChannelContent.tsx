import Cruitmember from './Cruitmember';
import StudyMember from './StudyMember';
import S from './StudyMemberChannelContent.module.css'

function StudyMemberChannelContent() {
  return (
    <div className={S.layout}>
      <div className={S.infoTitleWrap}>
        <img src="/images/thumb.png" alt="" />
        <div className={S.infoTitleText}>
          <div className={S.infoTitle}>
            <h2>🖥️ 프로그래머스</h2>
            <span className={S.dDayCounter}>
              D - <span>0</span>
              <span>1</span>
              <span>6</span>
            </span>
          </div>
          <ul className={S.infoList}>
            <li>카테고리</li>
            <li>카테고라</li>
            <li>카테고리</li>
            <li>카테고리</li>
          </ul>
        </div>
      </div>
      <article className={S.content}>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laborum illum
        optio eveniet obcaecati, blanditiis delectus aliquam veritatis officia
        cupiditate dicta laboriosam atque neque iste voluptates ipsum
        repudiandae veniam nam esse. <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad, vitae
        dignissimos, quo laborum accusantium sunt, aspernatur possimus
        voluptatibus dolorem fugit ipsum dolores explicabo nam optio cumque
        rerum eos voluptates dolore! <br />
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis
        dolorem alias totam exercitationem quaerat eaque accusantium earum, a,
        impedit necessitatibus, porro ut. Odio quam quidem consectetur eligendi
        itaque. Odio, molestiae!
      </article>

      <article className={S.card}>
        <div className={S.cardHeader}>
          <p>프로젝트안내</p>
          <button type="button">프로젝트생성</button>
        </div>
        <Cruitmember />
      </article>

      <article className={S.members}>
        <h3>스터디멤버</h3>
        <div className={S.memberList}>
          <StudyMember />
        </div>
      </article>
    </div>
  );
}
export default StudyMemberChannelContent;
