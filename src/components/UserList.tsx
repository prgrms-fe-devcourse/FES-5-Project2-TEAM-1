import S from "@/components/Layout/LeftSidebar.module.css";
import E from "./UserList.module.css";
import { useEffect, useState } from "react";
import supabase from "@/supabase/supabase";
import type { User } from "@/pages/Mypage/Mypage";
import type { StatusCode } from "./Layout/RightSidebar";
import { Link } from "react-router-dom";

function UserList() {
  const [openPopupIndex, setOpenPopupIndex] = useState<number | null>(null);
  const [userData, setUserData] = useState<User[] | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: fetchData, error: fetchError } = await supabase
        .from("user_base")
        .select(` *, profile: user_profile(*)`);

      if (fetchData) {
        const filterData = fetchData.filter(
          (user) =>
            user.profile[0].profile_id !==
            "a51ad237-ffd7-44c9-b00d-1f6f007f0999"
        );
        setUserData(filterData);
      }
      if (fetchError) {
        console.log(fetchError);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("status-list")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_base",
        },
        (payload) => {
          const updatedUser = payload.new;
          setUserData((prevData) => {
            if (!prevData) return prevData;
            return prevData.map((user) =>
              user.id === updatedUser.id
                ? { ...user, status: updatedUser.status }
                : user
            );
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // 현재 열려있는 팝업이 있고, 클릭한 요소가 팝업이나 버튼이 아니라면 닫기
      const target = e.target as HTMLElement;
      const isInsidePopupOrButton = target.closest(`.${S.enterUser}`);

      if (!isInsidePopupOrButton) {
        setOpenPopupIndex(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handlePopupToggle = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.stopPropagation();
    setTimeout(() => {
      setOpenPopupIndex((prev) => (prev === index ? null : index));
    }, 0);
  };

  const statusClassName = (status: StatusCode) => {
    const statusNum = Number(status);
    switch (statusNum) {
      case 0:
        return S.online;
      case 1:
        return S.offline;
      case 2:
        return S.dnd;
      case 3:
        return S.away;
      default:
        return S.offline; // 기본은 오프라인
    }
  };

  return (
    <>
      <ul className={S.recentEnterUser}>
        {userData &&
          userData.map((user, i) => (
            <li
              className={S.enterUser}
              key={user.id}
              style={{ position: "relative" }}
            >
              <button
                className={S.enterUser}
                onClick={(e) => handlePopupToggle(e, i)}
              >
                <div className={S.profileImage}>
                  {user.profile[0]?.profile_images ? (
                    <img src={user.profile[0]?.profile_images} alt="" />
                  ) : (
                    <img
                      src="	https://i.pinimg.com/1200x/bf/9f/7a/bf9f7a293c4f8c82ca424a8bc556e463.jpg"
                      alt=""
                    />
                  )}
                  <div
                    className={`${S.statusDot} ${statusClassName(
                      Number(user.status) as StatusCode
                    )}`}
                  ></div>
                </div>
                <p>{user.nickname ? user.nickname : "프둥이"}</p>
              </button>
              {openPopupIndex === i && (
                <div className={E.popup}>
                  <ul>
                    <li>
                      <Link to={`/mypage/${user.profile[0]?.profile_id}`}>
                        마이페이지
                      </Link>
                    </li>
                    <li>
                      <a>피어리뷰</a>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          ))}
      </ul>
    </>
  );
}

export default UserList;
