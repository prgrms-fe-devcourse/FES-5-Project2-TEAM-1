import S from "./RghtSidebar.module.css";
import "../../style/reset.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { useEffect, useRef, useState } from "react";
import supabase from "@/supabase/supabase";
import Notification from "./Notification";

import Online from "/icons/online.svg";
import Offline from "/icons/offline.svg";
import Away from "/icons/away.svg";
import Dnd from "/icons/dnd.svg";
import gsap from "gsap";
import { showConfirmAlert, showInfoAlert } from "@/utils/sweetAlert";

type CurrentUser = {
  profileId: string;
  email: string;
  id: string;
  profileImage: string;
  status?: StatusCode;
  name: string;
};

interface Overlay {
  isOverlay: boolean;
  setIsOverlay: (value: boolean) => void;
  isNotification: boolean;
  setIsNotification: (value: boolean) => void;
}

export type StatusCode = 0 | 1 | 2 | 3 | null;

function RightSidebar({
  isOverlay,
  setIsOverlay,
  isNotification,
  setIsNotification,
}: Overlay) {
  const { user, isLoading, logout, profileId } = useAuth();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [status, setStatus] = useState<StatusCode>(null);
  const [isStatusClicked, setIsStatusClicked] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [loading, setLoading] = useState(false);

  const popupRef = useRef<HTMLUListElement | null>(null);
  const [messageReady, setMessageReady] = useState(false);
  const [scrapReady, setScrapReady] = useState(false);
  const [membershipReady, setMembershipReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initUser = async () => {
      if (!isLoading && user && profileId) {
        const { data: nickname, error: nameError } = await supabase
          .from("user_base")
          .select("nickname")
          .eq("id", user.id)
          .single();

        if (nameError) {
          console.error("정보 불러오기 실패:", nameError?.message);
          return;
        }
        const { data, error } = await supabase
          .from("user_profile")
          .select("profile_images")
          .eq("profile_id", profileId)
          .single();
        if (!data || error) {
          console.error("프로필 이미지 불러오기 실패", error.message);
          return;
        }
        // 2. currentUser에 status 포함시켜 초기화
        setCurrentUser({
          profileId,
          email: user.email,
          id: user.id,
          profileImage: data.profile_images,
          status: 0,
          name: nickname.nickname,
        });

        // 3. 별도 status 상태도 동기화
        setStatus(0);
        setLoading(true);
      } else if (!isLoading && !user && !profileId) {
        setLoading(true);
      }
    };

    initUser();
  }, [isLoading, user, profileId]);
  useEffect(() => {
    const channel = supabase
      .channel("user_info")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_base",
          filter: `id=eq.${user?.id}`,
        },
        (payload) => {
          if (payload.new.id === user?.id) {
            setCurrentUser((prev) =>
              prev ? { ...prev, name: payload.new.nickname } : prev
            );
          }
        }
      )
      .subscribe();
    const profile_channel = supabase
      .channel("user_profile_info")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_profile",
          filter: `profile_id=eq.${profileId}`,
        },
        (payload) => {
          if (payload.new.profile_id === profileId) {
            setCurrentUser((prev) =>
              prev
                ? { ...prev, profileImage: payload.new.profile_images }
                : prev
            );
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(profile_channel);
      supabase.removeChannel(channel);
    };
  }, [user?.id, profileId]);

  useEffect(() => {
    gsap.fromTo(
      "#popupBox",
      { opacity: 0, y: -10, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
        pointerEvents: "auto",
      }
    );
  }, [isStatusClicked]);

  useEffect(() => {
    const outSideClick = (e: MouseEvent) => {
      const { target } = e;

      if (
        isStatusClicked &&
        popupRef.current &&
        !popupRef.current.contains(target as Node)
      ) {
        setIsStatusClicked(false);
      }
    };
    document.addEventListener("click", outSideClick);
    return () => {
      document.removeEventListener("click", outSideClick);
    };
  }, [isStatusClicked, popupRef]);

  const handleLogout = async () => {
    showConfirmAlert("정말 로그아웃 하시겠습니까?").then((result) => {
      if (result.isConfirmed) {
        if (currentUser) {
          supabase
            .from("user_base")
            .update({ status: 1 }) // 1: 오프라인
            .eq("id", currentUser.id);
        }

        setStatus(1);

        logout();
        setCurrentUser(null);

        navigate("/");
      }
    });
  };

  const updateStatusInDB = async (newStatus: StatusCode): Promise<boolean> => {
    if (!currentUser) return false;

    const { error } = await supabase
      .from("user_base")
      .update({ status: newStatus })
      .eq("id", currentUser.id);

    if (error) {
      console.error("상태 업데이트 실패", error);
      return false;
    }

    return true;
  };

  const handleNotification = () => {
    setIsNotification(!isNotification);
    setIsOverlay(!isOverlay);
  };

  const handleStatus = async (selected: StatusCode) => {
    const newStatus = status === selected ? null : selected;
    const success = await updateStatusInDB(newStatus);
    if (success) {
      setStatus(newStatus);
      setCurrentUser((prev) => (prev ? { ...prev, status: newStatus } : prev));
    }
    setIsClicked((prev) => !prev);
    console.log(isClicked);
  };
  const handleReady = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    showInfoAlert("준비중입니다.");
  };
  return (
    <nav className={S.container}>
      <div className={S.height}>
        <div>
          <div className={S.loginLogout}>
            {loading &&
              (currentUser ? (
                <button onClick={handleLogout}>
                  <p className={S.logout}>로그아웃</p>
                </button>
              ) : (
                <>
                  <Link to="/login" className={S.linkButton}>
                    로그인
                  </Link>
                  <Link to="/register" className={S.linkButton}>
                    회원가입
                  </Link>
                </>
              ))}
          </div>
          <div className={S.loginBox}>
            {loading &&
              (currentUser ? (
                <img
                  className={S.profileImage}
                  src={currentUser.profileImage || "/images/여울.png"}
                  alt="프로필"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTimeout(() => {
                      setIsStatusClicked((prev) => !prev);
                    }, 0);
                  }}
                />
              ) : (
                <img
                  className={S.profileImage}
                  src={"/images/여울.png"}
                  alt="프로필"
                />
              ))}
            {isStatusClicked && (
              <div className={S.statusPopup} id="popupBox">
                <ul ref={popupRef}>
                  <li
                    onClick={() => handleStatus(0)}
                    className={status === 0 ? S.clicked : ""}
                  >
                    <div className={S.online}>
                      <img src={Online} />
                    </div>
                    온라인
                  </li>
                  <li
                    onClick={() => handleStatus(3)}
                    className={status === 3 ? S.clicked : ""}
                  >
                    <div className={S.away}>
                      <img src={Away} />
                    </div>
                    자리 비움
                  </li>
                  <li
                    onClick={() => handleStatus(2)}
                    className={status === 2 ? S.clicked : ""}
                  >
                    <div className={S.dnd}>
                      <img src={Dnd} />
                    </div>
                    방해 금지
                  </li>
                  <li
                    onClick={() => handleStatus(1)}
                    className={status === 1 ? S.clicked : ""}
                  >
                    <div className={S.offline}>
                      <img src={Offline} />
                    </div>
                    오프라인 표시
                  </li>
                </ul>
              </div>
            )}
            {loading &&
              (currentUser?.profileId ? (
                currentUser?.profileId ===
                "a51ad237-ffd7-44c9-b00d-1f6f007f0999" ? (
                  <Link
                    to={`/admin`}
                    className={S.loginBoxGreeting}
                    title="관리자페이지 이동"
                  >
                    <p>Admin</p>
                    <h3>관리자 계정</h3>
                  </Link>
                ) : (
                  <Link
                    to={`/mypage/${currentUser.profileId}`}
                    className={S.loginBoxGreeting}
                    title="마이페이지 이동"
                  >
                    <p>Hello</p>
                    {currentUser.name === "" || !currentUser.name ? (
                      <p className={S.nonNickName}>프둥이</p>
                    ) : (
                      <h3>{currentUser.name}</h3>
                    )}
                  </Link>
                )
              ) : (
                <div className={S.loginBoxGreeting}>
                  <p>Hello</p>
                  <h3>Guest</h3>
                </div>
              ))}
          </div>
        </div>
      </div>

      <nav>
        <ul className={S.navListWrap}>
          <li>My menu</li>
          <li className={S.navList}>
            {isNotification && (
              <div className={S.notifyPanel}>
                <h4>Notification</h4>
                <div className={S.notificationList}>
                  <Notification />
                </div>
              </div>
            )}
            <span className={S.navListText} onClick={handleNotification}>
              <img
                src="/icons/notification.svg"
                className={S.notifiIcon}
                alt="알림아이콘"
              />

              <h3>Notification</h3>
            </span>
          </li>
          <li
            className={S.navList}
            onMouseEnter={() => setMessageReady(true)}
            onMouseLeave={() => setMessageReady(false)}
          >
            <a href="#" className={S.navListText} onClick={handleReady}>
              <img src="/icons/message.svg" alt="메세지 아이콘" />

              <h3
                className={`${S.fadeText} ${
                  messageReady ? S.visible : S.hidden
                }`}
              >
                {messageReady ? "In Progress" : "Message"}
              </h3>
            </a>
          </li>
          <li className={S.navList}>
            <Link to="/team" className={S.navListText}>
              <img src="/icons/team.svg" alt="팀 아이콘" />

              <h3>Team</h3>
            </Link>
          </li>
          <li
            className={S.navList}
            onMouseEnter={() => setScrapReady(true)}
            onMouseLeave={() => setScrapReady(false)}
          >
            <a href="#" className={S.navListText} onClick={handleReady}>
              <img src="/icons/scrapicon.svg" alt="스크랩 아이콘" />
              <h3
                className={`${S.fadeText} ${scrapReady ? S.visible : S.hidden}`}
              >
                {scrapReady ? "In Progress" : "Scrap"}
              </h3>
            </a>
          </li>
        </ul>
      </nav>

      <aside>
        <div className={S.membershipBox}>
          <div className={S.membershipTextBox}>
            <h4>멤버쉽 이용하기</h4>
            <p>
              월 1만원으로 <br /> 더 많은 기능을 이용할 수 있어요
            </p>
            <button
              type="button"
              className={S.membershipButton}
              onMouseEnter={() => setMembershipReady(true)}
              onMouseLeave={() => setMembershipReady(false)}
            >
              {membershipReady ? "In Progress" : "가입하기"}
            </button>
          </div>
        </div>
      </aside>
    </nav>
  );
}
export default RightSidebar;
