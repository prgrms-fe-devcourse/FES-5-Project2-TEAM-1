import { NavLink, Outlet, useParams } from "react-router-dom";
import S from "./StudyMemberChannel.module.css";
import supabase from "@/supabase/supabase";
import { useToast } from "@/utils/useToast";
import { useAuth } from "@/auth/AuthProvider";
import { useAdmin } from "./context/useAdmin";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function StudyMemberChannel() {
  const { id } = useParams();
  const { success, error } = useToast();
  const { profileId } = useAuth();
  const { isAdmin } = useAdmin();
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    const checkIsMember = async () => {
      if (!id || !profileId) return;

      const { data, error } = await supabase
        .from("approve_member")
        .select("status::text")
        .match({
          board_id: id,
          profile_id: profileId,
        })
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      if (data?.status === "1") {
        setIsMember(true);
      }
    };

    checkIsMember();
  }, [id, profileId]);

  const handleJoin = async () => {
    if (!profileId) error('로그인을 해주세요');

    const { count, error: countError } = await supabase
      .from('approve_member')
      .select('status::text', { count: 'exact', head: true })
      .match({
        board_id: id
      })
      
    if( countError ) {
      console.error('패치 에러');
    }

    const { data: boardData, error: boardError} = await supabase
      .from('board')
      .select('member')
      .match({
        board_id: id
      })

    if( boardError ) {
      console.error('패치 에러');
    }

    if(  boardData && count && boardData.length > 0 && boardData[0].member <= count ) {
      toast.error('이미 가입 승인 멤버가 가득찼습니다.', {autoClose: 1500})
      return;
    } 

    const { data, error: fetchError } = await supabase
      .from("approve_member")
      .select("status::text")
      .match({
        board_id: id,
        profile_id: profileId,
      })
      .maybeSingle();

    if (fetchError) return console.error();
    switch (data?.status) {
      case "0":
        error("이미 가입신청을 요청하신 채널입니다");
        return;
      case "1":
        error("이미 채널멤버입니다");
        setIsMember(true);
        return;
      case "2":
        error("가입신청이 거절되었습니다");
        setIsMember(false);
        return;
      default:
        success("가입 신청을 요청하셨습니다");
    }

    const { error: memberError } = await supabase
      .from("approve_member")
      .insert([
        {
          profile_id: profileId,
          board_id: id,
          status: 0,
        },
      ]);
    if (memberError) console.error();
  };

  return (
    <main className={S.container}>
      <nav className={S.header}>
        <div className={S.headerinner}>
          <NavLink
            to="."
            end
            className={({ isActive }) => (isActive ? S.active : "")}
          >
            홈
          </NavLink>
          {(isMember || isAdmin) && (
            <NavLink
              to="thread"
              className={({ isActive }) => (isActive ? S.active : "")}
            >
              스레드
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="management"
              className={({ isActive }) => (isActive ? S.active : "")}
            >
              관리
            </NavLink>
          )}
        </div>
        {!isAdmin && !isMember && (
          <button className={S.joinBtn} type="submit" onClick={handleJoin}>
            가입하기
          </button>
        )}
      </nav>

      <Outlet />
    </main>
  );
}
export default StudyMemberChannel;
