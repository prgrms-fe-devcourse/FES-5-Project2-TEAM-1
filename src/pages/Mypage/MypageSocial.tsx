import MypageSocialConvert from "./components/MypageSocialConvert";
import type { User } from "./Mypage";
import S from "./MypageTop.module.css";
import E from "./MypageEdit.module.css";
import { useEffect, useRef, useState } from "react";
import compareUserId from "@/utils/compareUserId";
import type { Tables } from "@/supabase/database.types";

import Instagram from "@/assets/instagram.svg";
import Github from "@/assets/github.svg";
import Discord from "@/assets/discord.svg";
import Slack from "@/assets/slack.svg";
import Linkedin from "@/assets/linkedin.png";
import Facebook from "@/assets/facebook.png";
import Line from "@/assets/line.png";
import Youtube from "@/assets/youtube.png";
import DefaultIcon from "/images/너굴.png";
import AddIcon from "/icons/add.svg";
import supabase from "@/supabase/supabase";
import { useToast } from "@/utils/useToast";
import gsap from "gsap";
import { toast } from "react-toastify";

interface Props {
  user: User | null;
  editMode: boolean;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

type Social = Tables<"user_social">;

function MypageSocial({ user, editMode, setUserData }: Props) {
  const profileId = user?.profile?.[0]?.profile_id;

  const [socialArray, setSocialArray] = useState<Social[] | null>(null);
  const [isClicked, setIsClicked] = useState<boolean[]>([]);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [pendingIcon, setPendingIcon] = useState<string[]>([]);
  const [addClicked, setAddClicked] = useState(false);

  const liRef = useRef<HTMLDivElement | null>(null);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const { error } = useToast();

  useEffect(() => {
    const fetchSocial = async () => {
      if ( !profileId) return;
      if( !editMode && profileId ) {
        const result = await compareUserId(profileId, "user_social");
        setSocialArray(result || []);
      }
    };

    fetchSocial();
  }, [profileId, editMode]);

//   useEffect(() => {
//   setAddClicked(false);
// }, []);

  useEffect(() => {
    return () => {
      setAddClicked(false);
    };
  }, [profileId]);

  useEffect(() => {
    if (!socialArray) return;
    const links = socialArray.map((s) => s.social_link);
    setInputValues(links);
    const socials = socialArray.map((s) => s.social);
    setPendingIcon(socials);

    setIsClicked((prev) => {
      const diff = socialArray.length - prev.length;
      if (diff > 0) {
        return [...prev, ...Array(diff).fill(false)];
      } else if (diff < 0) {
        // 줄어든 항목만큼 제거
        return prev.slice(0, socialArray.length);
      }
      return prev;
    });
  }, [socialArray]);

  useEffect(() => {
    if (!editMode) {
      setIsClicked((prev) => prev.map(() => false));
    }

    const cleanUpEmptySocialLinks = async () => {
    if (!socialArray || !Array.isArray(socialArray)) return;

    const emptySocials = socialArray.filter((s) => s.social_link === '');

    if (emptySocials.length === 0) return;

    // 삭제할 social id 목록 수집
    const idsToDelete = emptySocials.map((s) => s.social_id); // id가 있다고 가정

    const { error: deleteError } = await supabase
      .from('user_social')
      .delete()
      .in('social_id', idsToDelete);

    if (deleteError) {
      toast.error('빈 링크 삭제 중 오류가 발생했어요.');
      console.error(deleteError.message);
      return;
    }

    // state 업데이트
    setSocialArray((prev) => {
      if (!prev) return prev;
      return prev.filter((item) => item.social_link !== '');
    });
  };
  cleanUpEmptySocialLinks();

  }, [editMode]);

  useEffect(() => {
    if (!addClicked || !profileId) return;

    const newItem = {
      // Use empty string or a temporary unique value for social_id and create_at
      profile_id: profileId,
      social: "personal website",
      social_link: "",
    };

    const fetchNewSocial = async () => {
      const { data, error: insertError } = await supabase
        .from("user_social")
        .insert([newItem])
        .select()
        .single();

      if (insertError) {
        error("새 링크 추가 실패!");
        return;
      }

      setSocialArray((prev) => (prev ? [...prev, data] : [data]));
      toast.info("새 링크를 추가할 수 있습니다.", {autoClose: 1500});
      setAddClicked(false);
    };
    fetchNewSocial();

    gsap.fromTo(
      "#newDiv",
      { opacity: 0, y: -10 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power1.out",
        onComplete: () => {
          // 필요한 경우 position이나 zIndex 재설정
          gsap.set("#newDiv", { clearProps: "all" }); // ← gsap이 설정한 속성 초기화
        },
      }
    );
  }, [addClicked, profileId]);

  useEffect(() => {
    if (liRef.current) {
      gsap.fromTo(
        liRef.current,
        {
          opacity: 0,
          y: -8,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [isClicked]);

  if (!profileId) {
    return <div className={S.mypageSocial}>Loading...</div>;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newInputValue = e.currentTarget.value;

    setInputValues((prev) => {
      const newArr = [...prev];
      newArr[index] = newInputValue;
      return newArr;
    });

    setPendingIcon((prev) => {
      const newArr = [...prev];
      if (newInputValue.includes("instagram")) newArr[index] = "instagram";
      else if (newInputValue.includes("github")) newArr[index] = "github";
      else if (newInputValue.includes("facebook")) newArr[index] = "facebook";
      else if (newInputValue.includes("youtube")) newArr[index] = "youtube";
      else if (newInputValue.includes("linkedin")) newArr[index] = "linkedin";

      return newArr;
    });
  };

  const handleIconList = (i: number) => {
    setIsClicked((prev) => {
      return prev.map((clicked, index) => (index === i ? !clicked : false));
    });
  };

  const handleClickedIcon = (
    e: React.MouseEvent<HTMLImageElement>,
    index: number
  ) => {
    const newSocial = e.currentTarget.alt;
    setPendingIcon((prev) => {
      const newArr = [...prev];
      newArr[index] = newSocial;
      return newArr;
    });

    setIsClicked((prev) => prev.map(() => false));
  };

  const handleSocialUpdate = async (index: number) => {
    if (!profileId || !socialArray || !socialArray[index]) return;

    const { social_id } = socialArray[index];
    const newSocial = pendingIcon[index];
    const newSocialLink = inputValues[index];

    if( newSocialLink === '' ) {
      toast.error('링크를 적어주세요.', {autoClose: 1500});
      return;
    }

    setSocialArray((prev) => {
      if (!prev) return prev;
      return prev.map((a, i) => {
        if (i === index) {
          return { ...a, social_link: newSocialLink, social: newSocial };
        }
        return a;
      });
    });

    const { error: socialError } = await supabase
      .from("user_social")
      .update({
        social: newSocial,
        social_link: newSocialLink,
      })
      .match({
        profile_id: profileId,
        social_id: social_id,
      });

    if (socialError) {
      error("업로드 실패");
      return;
    }

    setUserData((prev) => {
      if (!prev) return prev;

      const prevSocial = prev.profile[0].social?.[0] || {};

      return {
        ...prev,
        profile: [
          {
            ...prev.profile[0],
            social: [
              {
                ...prevSocial,
                social: newSocial,
                social_link: newSocialLink,
              },
            ],
          },
        ],
      };
    });

    toast.info("새 링크가 저장되었습니다.");
  };

  const iconSrc = (index: number) => {
    const icon = pendingIcon[index];

    return icon === "instagram"
      ? Instagram
      : icon === "github"
      ? Github
      : icon === "discord"
      ? Discord
      : icon === "slack"
      ? Slack
      : icon === "facebook"
      ? Facebook
      : icon === "linkedin"
      ? Linkedin
      : icon === "line"
      ? Line
      : icon === "youtube"
      ? Youtube
      : DefaultIcon;
  };

  const handleSocialDelete = async (index: number) => {
    if (!profileId || !socialArray) return;

    const { social_id } = socialArray[index];

    setSocialArray((prev) => {
      if (!prev) return prev;
      return prev.filter((_, i) => !(i === index));
    });

    const { error: minusError } = await supabase
      .from("user_social")
      .delete()
      .match({
        profile_id: profileId,
        social_id: social_id,
      });

    if (minusError) {
      error("삭제 실패!");
      return;
    }

    setUserData((prev) => {
      if (!prev) return prev;

      const filteredSocial =
        prev.profile[0].social?.filter((i) => i.social_id !== social_id) || [];

      return {
        ...prev,
        profile: [
          {
            ...prev.profile[0],
            social: filteredSocial,
          },
        ],
      };
    });

    toast.info("소셜 링크가 제거되었습니다.", {autoClose: 1500});
  };

  const addSocialLink = () => {
    setAddClicked(true);
  };

  return (
    <>
      <div className={S.mypageSocial}>
        <h2>소셜링크</h2>
        {editMode ? (
          socialArray &&
            socialArray.map((s, i) => (
              <div key={s.social_id} className={E.editSocialWrapper} id="newDiv">
                <div>
                  <button type="button" onClick={() => handleIconList(i)}>
                    <img
                      key={i}
                      src={iconSrc(i)}
                      alt={`${pendingIcon[i]} icon`}
                    />
                  </button>
                  {isClicked[i] && (
                    <div id="iconBox" ref={liRef} className={E.editIconList}>
                      <ul>
                        <li>
                          <img
                            onClick={(e) => {
                              handleClickedIcon(e, i);
                            }}
                            src={Instagram}
                            alt="instagram"
                          />
                        </li>
                        <li>
                          <img
                            onClick={(e) => {
                              handleClickedIcon(e, i);
                            }}
                            src={Github}
                            alt="github"
                          />
                        </li>
                        <li>
                          <img
                            onClick={(e) => {
                              handleClickedIcon(e, i);
                            }}
                            src={Discord}
                            alt="discord"
                          />
                        </li>
                        <li>
                          <img
                            onClick={(e) => {
                              handleClickedIcon(e, i);
                            }}
                            src={Slack}
                            alt="slack"
                          />
                        </li>
                        <li>
                          <img
                            onClick={(e) => {
                              handleClickedIcon(e, i);
                            }}
                            src={Facebook}
                            alt="facebook"
                          />
                        </li>
                        <li>
                          <img
                            onClick={(e) => {
                              handleClickedIcon(e, i);
                            }}
                            src={Line}
                            alt="line"
                          />
                        </li>
                        <li>
                          <img
                            onClick={(e) => {
                              handleClickedIcon(e, i);
                            }}
                            src={Linkedin}
                            alt="linkedin"
                          />
                        </li>
                        <li>
                          <img
                            onClick={(e) => {
                              handleClickedIcon(e, i);
                            }}
                            src={Youtube}
                            alt="youtube"
                          />
                        </li>
                        <li>
                          <img
                            onClick={(e) => {
                              handleClickedIcon(e, i);
                            }}
                            src={DefaultIcon}
                            alt="personal website"
                          />
                        </li>
                      </ul>
                    </div>
                  )}
              </div>
                <div className={E.editSocialInput}>
                  <input
                    ref={(el) => {
                      if (el) inputRefs.current[i] = el;
                    }}
                    onChange={(e) => handleInputChange(e, i)}
                    defaultValue={s.social_link}
                  />
                </div>
                <div className={E.editSocialSaveBtn}>
                  <button onClick={() => handleSocialUpdate(i)}>저장</button>
                  <button onClick={() => handleSocialDelete(i)}>삭제</button>
                </div>
              </div>
            ))
          ) : (
             socialArray && socialArray.length === 0  
              ? (
                <div className={S.noSocial}>
                    <p>
                      추가한 소셜링크가 없습니다 <br />
                      나를 알려줄 수 있는 소셜링크를 추가해보세요!<br />
                    </p>
                </div>
              )
              : (<MypageSocialConvert
                user={user}
                socialData={socialArray}
                setSocialData={setSocialArray}
              />)
          )}
          {editMode && (
            <div className={E.editSocialAdd} onClick={() => addSocialLink()}>
              <img src={AddIcon} />
            </div>
          )}
      </div>
    </>
  );
}

export default MypageSocial;
