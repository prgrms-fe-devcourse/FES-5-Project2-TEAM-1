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
import { showInfoAlert } from "@/utils/sweetAlert";

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
    if (currentUser) {
      await supabase
        .from("user_base")
        .update({ status: 1 }) // 1: 오프라인
        .eq("id", currentUser.id);
    }

  setStatus(1);

    await logout()
    setCurrentUser(null);
    navigate("/");
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
                <Link
                  to={`/mypage/${currentUser.profileId}`}
                  className={S.loginBoxGreeting}
                  title="마이페이지 이동"
                >
                  <p>Hello</p>
                  <h3>{currentUser.name}</h3>
                </Link>
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
              <svg
                width="24"
                height="24"
                viewBox="4 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.8001 7.04541C4.40422 7.04541 4.05311 7.23711 3.83454 7.53274C3.92506 7.56248 4.01138 7.61008 4.08821 7.67593L10.9263 13.5372C11.5442 14.0668 12.456 14.0668 13.0739 13.5372L19.912 7.67593C19.9888 7.61008 20.0752 7.5625 20.1657 7.53276C19.9471 7.23712 19.596 7.04541 19.2001 7.04541H4.8001Z"
                  fill="#222222"
                />
                <path
                  d="M20.4001 9.2332L14.0501 14.676C12.8705 15.6872 11.1298 15.6872 9.95013 14.676L3.6001 9.23316V16.6454C3.6001 17.3082 4.13736 17.8454 4.8001 17.8454H19.2001C19.8628 17.8454 20.4001 17.3082 20.4001 16.6454V9.2332Z"
                  fill="#222222"
                />
              </svg>
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
              <svg
                width="24"
                height="25"
                viewBox="3 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.225 12.4894C19.0859 13.1296 18.6657 13.6729 18.0811 13.9686C17.4639 14.2808 16.7349 14.2808 16.1176 13.9686C15.5331 13.6729 15.1129 13.1296 14.9738 12.4894L14.9459 12.3613C14.8045 11.7103 14.955 11.03 15.3579 10.4993L15.4022 10.4409C15.8052 9.91027 16.4331 9.59863 17.0994 9.59863C17.7657 9.59863 18.3936 9.91027 18.7965 10.4409L18.8409 10.4993C19.2438 11.03 19.3943 11.7103 19.2528 12.3613L19.225 12.4894Z"
                  fill="#222222"
                />
                <path
                  d="M20.3594 18.9451H15.9V18.8231C15.9 17.7478 15.5414 16.7329 14.9186 15.9152C16.4116 15.4227 18.0302 15.4494 19.5097 15.9954C20.4049 16.3257 20.9994 17.1788 20.9994 18.133V18.3051C20.9994 18.6586 20.7128 18.9451 20.3594 18.9451Z"
                  fill="#222222"
                />
                <path
                  d="M13.44 20.1452H3.96C3.42981 20.1452 3 19.7154 3 19.1852V18.8231C3 17.4521 3.84808 16.224 5.13021 15.7384C7.43035 14.8672 9.96965 14.8672 12.2698 15.7384C13.5519 16.224 14.4 17.4521 14.4 18.8231V19.1852C14.4 19.7154 13.9702 20.1452 13.44 20.1452Z"
                  fill="#222222"
                />
                <path
                  d="M7.2424 12.6686C8.15624 13.143 9.24376 13.143 10.1576 12.6686C10.9981 12.2323 11.599 11.4424 11.7952 10.516L11.8566 10.226C12.0579 9.27507 11.8422 8.28343 11.2641 7.50202L11.165 7.36809C10.5868 6.58653 9.67221 6.12549 8.7 6.12549C7.72779 6.12549 6.81319 6.58653 6.23496 7.36809L6.13587 7.50202C5.55775 8.28343 5.34208 9.27507 5.54344 10.226L5.60484 10.516C5.80102 11.4424 6.40189 12.2323 7.2424 12.6686Z"
                  fill="#222222"
                />
              </svg>
              <h3>Team</h3>
            </Link>
          </li>
          <li
            className={S.navList}
            onMouseEnter={() => setScrapReady(true)}
            onMouseLeave={() => setScrapReady(false)}
          >
            <a href="#" className={S.navListText} onClick={handleReady}>
              <svg
                width="24"
                height="19"
                viewBox="5 0 14 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.0014 17.872L13.6261 17.0912L13.0014 17.872ZM6.37599 13.5712L7.00068 14.3521L6.37599 13.5712ZM7.62538 13.5712L7.00068 14.3521L7.62538 13.5712ZM0.999958 17.872L1.62465 18.6529L0.999958 17.872ZM1.9999 1.0188V0.0187988L12.0015 0.0187988V1.0188V2.0188L1.9999 2.0188V1.0188ZM0.9999 17.872H-0.000100136L-0.000100136 2.0188H0.9999H1.9999L1.9999 17.872L0.9999 17.872ZM6.37599 13.5712L7.00068 14.3521L1.62465 18.6529L0.999958 17.872L0.375263 17.0912L5.75129 12.7903L6.37599 13.5712ZM13.0014 17.872L12.3767 18.6529L7.00068 14.3521L7.62538 13.5712L8.25007 12.7903L13.6261 17.0912L13.0014 17.872ZM13.0015 2.0188H14.0015L14.0015 17.872H13.0015H12.0015L12.0015 2.0188H13.0015ZM13.0014 17.872V16.872C12.4181 16.872 12.0015 17.3513 12.0015 17.872H13.0015H14.0015C14.0015 18.3928 13.5848 18.872 13.0014 18.872V17.872ZM13.0014 17.872L13.6261 17.0912C13.4488 16.9493 13.2285 16.872 13.0014 16.872V17.872V18.872C12.7743 18.872 12.554 18.7947 12.3767 18.6529L13.0014 17.872ZM6.37599 13.5712L5.75129 12.7903C6.48173 12.206 7.51964 12.206 8.25007 12.7903L7.62538 13.5712L7.00068 14.3521L7.00068 14.3521L6.37599 13.5712ZM0.999936 17.872L0.999936 16.872C0.780693 16.872 0.558582 16.9445 0.375263 17.0912L0.999958 17.872L1.62465 18.6529C1.44132 18.7996 1.2192 18.872 0.999936 18.872V17.872ZM0.9999 17.872L1.9999 17.872C1.9999 17.3197 1.5522 16.872 0.999936 16.872L0.999936 17.872V18.872C0.447631 18.872 -0.000100136 18.4243 -0.000100136 17.872H0.9999ZM12.0015 1.0188V0.0187988C13.106 0.0187988 14.0015 0.914228 14.0015 2.0188H13.0015H12.0015L12.0015 2.0188V1.0188ZM1.9999 1.0188V2.0188L1.9999 2.0188H0.9999H-0.000100136C-0.000100136 0.914233 0.895328 0.0187988 1.9999 0.0187988V1.0188Z"
                  fill="#222222"
                />
              </svg>
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
