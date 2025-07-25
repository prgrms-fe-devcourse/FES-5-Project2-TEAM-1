/**
 * 1. supabase 연결
 * 2. 현재 유저 아이디 전달
 * 3. 불러올 테이블 이름 전달
 * 4. 현재 유저 아이디 === 테이블 내에 유저 아이디 일치하는지 확인
 * 5. 일차하는 row가 있다면 해당 데이터 통째로 반환
 */

import supabase from "../supabase/supabase";
import type { Database } from "src/supabase/database.types";

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

// type Data = Tables<'user_base'|'user_profile'|'user_social'|'user_interest'|'post'|'peer_review'|'channel'>
// 위처럼 하니 리턴 타입이 유니언 타입인 Data[]로 처리돼서 Tables<'posts'>[](쓰는 곳에서 타입) 와 타입 불일치 오류가 발생했다
// 여러개의 타입을 받고, 내보내고 싶을땐 제네릭을 도입하자

async function compareUserId<T extends keyof Database['public']['Tables']>(current_user:string, table:T):Promise<Tables<T>[]|null> {


  if(table==='user_base'){
    const {data, error} = await supabase
    .from(table)
    .select('*')
    .eq('id',current_user);

    if(error){
      console.error('Error fetching data: ', error)
      return null;
    }
    return data;

  } else {
    const {data, error} = await supabase
    .from(table)
    .select('*')
    .eq('profile_id',current_user);

    if(error){
      console.error('Error fetching data: ', error)
      return null;
    }
    return data;
  }

}
export default compareUserId;