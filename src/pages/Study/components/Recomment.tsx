import type { Tables } from '@/supabase/database.types'
import S from './Recomment.module.css'

type Props = {
 reply: Tables<'comment_reply' >
  handleLikeToggle: (a: string) => void
}
function Recomment({ reply,handleLikeToggle}: Props) {
  const { reply_id,contents,likes,created_at }=reply
  
  return (
    <div className={S.container} key={reply_id}>
  
      <div className={S.profileImage}>
        <img src="/images/여울.png" alt="프로필" />
      </div>
      <div className={S.contentBox}>
        <div className={S.meta}>
          <span className={S.username}>User</span>
          <span className={S.time}>{created_at}</span>
        </div>
        <div className={S.text}>{contents}</div>
        <div className={S.actions}>
          <div className={S.likeBtn}>
            <button type="button" onClick={() => handleLikeToggle(comment_id)}>
              {isPress ? (
                <img src="/icons/likeActive.png" alt="좋아요 활성화" />
              ) : (
                <img src="/icons/like.svg" alt="" />
              )}
            </button>
            <span>{likes}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Recomment