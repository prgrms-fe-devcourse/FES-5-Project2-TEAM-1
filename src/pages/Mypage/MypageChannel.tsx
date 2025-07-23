import { useEffect, useState } from "react";
import type { Tables } from "src/supabase/database.types"
import compareUserId from "../../utils/compareUserId";


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