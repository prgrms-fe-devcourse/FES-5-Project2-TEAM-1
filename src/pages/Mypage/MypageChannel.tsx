import { useEffect, useState } from "react";
import type { Tables } from "src/supabase/database.types"
import compareUserId from "../../utils/compareUserId";
/**
 * - 참여중 스터디 확인
    - 현재 접속한 유저 id와 channel 테이블의 profile_id가 같은게 있는지 확인하고,
    - 같은걸 기준으로 채널의 ttile과 channel_images 가져와서 카드로 뿌리기
 */

type Channel = Tables<'channel'>;

function MypageChannel() {
  const [channels, setChannels] = useState<Channel[]|null>(null);

  useEffect( () => {
    const fetchChannels = async() => {
      const result = await compareUserId('test1','channel')
      setChannels(result);
    };
    fetchChannels();
  },[])

  console.log('가입된 채널',channels);

  return (
    <div>MypageChannel</div>
  )
}
export default MypageChannel