import type { User } from './Mypage';
import S from './MypageTop.module.css';
import E from './MypageEdit.module.css';
import minus from '/icons/minus.svg';
import plus from '/icons/plus.svg';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import InterestDropdown from './components/InterestDropdown';
import supabase from '@/supabase/supabase';
import { useToast } from '@/utils/useToast';
import compareUserId from '@/utils/compareUserId';
import type { Tables } from '@/supabase/database.types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

interface Props {
  user: User | null;
  editMode: boolean,
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

type Interest = Tables<'user_interest'>;

function MypageInterest({user, editMode, setUserData}: Props) {
   const profileId = user?.profile?.[0]?.profile_id;

  const [interestArray, setInterestArray] = useState<Interest[] | null>(null);
  const [isFive, setIsFive] = useState(false);
  const [plusClicked, setPlusClicked] = useState(false);

  const minusRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const divRefs = useRef<(HTMLDivElement | null)[]>([]);
  const divRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const { error } = useToast();
    const navigate = useNavigate();

  useEffect(() => {
    
    const fetchInterest = async () => {
      if( !profileId ) return;
      const result = await compareUserId(profileId, 'user_interest');
      setInterestArray(result || []);
    }

    fetchInterest();

    if(divRef.current){
      gsap.from(divRef.current, {
        x: 10,
        opacity: 0,
        duration: 0.3,
        ease: 'power1.out',
      })
    };

  }, [profileId])

    useEffect(() => {
      if( interestArray && interestArray.length >= 5 ) {
        setIsFive(true);
      } else {
        setIsFive(false);
      }
    }, [interestArray])

  useEffect(() => {
    const validElements = minusRefs.current.filter(el => el !== null) as HTMLButtonElement[];
    if( validElements.length > 0 ) {
      gsap.from(validElements, {
        y: -10,
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          gsap.set(validElements, { clearProps: 'all' });
        }
      });
    }

    if( editMode ) {
      setPlusClicked(false);
    }
  }, [editMode])

  useEffect(() => {
    if(imgRef.current) {
      gsap.fromTo('#plusBox', 
        { opacity: 0, scale: 0.8, y: -10 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
        clearProps: 'transform,opacity', // transform 전체 제거
      }
      )
    }
  }, [plusClicked])

  const handlePlusInterest = () => {
    setPlusClicked(true);
  }

  const handleMinus = async ( index: number) => {
    if (!profileId) return;
    if(!interestArray) return;

      const text = divRefs.current[index]?.textContent;
      const { interest_id, interest } = interestArray[index];

      setInterestArray((prev) => {
        if( !prev ) return prev;
        return prev.filter((_, i) => !(i === index && prev[i].interest == text)); 
      })
  
      const { error: minusError } = await supabase
        .from('user_interest')
        .delete()
        .match({
          'profile_id': profileId,
          'interest_id': interest_id,
        })
  
     if( minusError ) {
      error('업로드 실패!');
      return;
     }

     setUserData((prev) => {
            if( !prev ) return prev;

            const filteredInterests = prev.profile[0].interest?.filter( i => i.interest !== interest) || [];

            return {
                ...prev,
                profile: [{
                     ...prev.profile[0],
                     interest: filteredInterests
                }]
            }
        })

        toast.info('관심사가 제거되었습니다.', { onClose() {
          navigate(`/mypage/${profileId}`)
        }, autoClose: 1500});

    }

  return (
    <>
        <div className={S.mypageInterest}>
          <h2>관심분야</h2>
          { editMode 
            ? <div className={S.InterestBlock}>
              { interestArray && interestArray.map((interest, index) => {
                const fontSize =
                interest.interest.length > 15 ? '0.8rem' :
                interest.interest.length > 12 ? '0.9rem' :
                '';
              return(
                <div key={interest.interest_id} className={E.editInterestBlockWrapper}>
                  <div
                    key={index}
                    ref={(el) => { divRefs.current[index] = el }}
                    className={S.InterestBlockEach}
                    style={fontSize ? {fontSize} : undefined}
                  >
                      {interest.interest}
                  </div>
                    <button 
                      ref={(el) => {minusRefs.current[index] = el}}
                      className={E.editInterestMinusBtn}
                      onClick={() => handleMinus(index)}
                    >
                      <img src={minus} alt='마이너스 버튼 아이콘' />
                    </button>
                  </div>
              )})}
                { !isFive && 
                    <div ref={divRef} className={S.InterestBlockEach}>
                      { plusClicked 
                        ? 
                        <InterestDropdown
                            plusClicked={plusClicked}
                            setPlusClicked={setPlusClicked}
                            userInterest={{ profile_id: profileId ?? ''}}
                            setUserData={setUserData}
                            user={user}
                            interestArray={interestArray}
                            setInterestArray={setInterestArray}
                            />
                        : <>           
                            <button
                              className={E.editInterestPlusBtn}
                              onClick={handlePlusInterest}
                              id='plusBox'
                            >
                              <img src={plus} ref={imgRef} alt='플러스 버튼 아이콘' />
                            </button>
                          </>
                        }
                      </div>
                    }
              </div>  
            : 
            <div className={S.InterestBlock}>
                { interestArray && interestArray.length !== 0 
                ? (interestArray.map((i) => {
                const fontSize =
                  i.interest.length > 15 ? '0.8rem' :
                  i.interest.length > 12 ? '0.9rem' :
                  '';
                return(
                    <div key={i.interest_id}>
                      <div className={S.InterestBlockEach}  style={fontSize ? {fontSize} : undefined}>{i.interest}</div>
                    </div>
                  )}))
                : (
                  <div className={S.noSocial}>
                    <p>
                      추가한 관심사가 없습니다 <br />
                      나를 알려줄 수 있는 관심사를 추가해보세요!<br />
                    </p>
                </div>
                )
                }
            </div>  
          }
        </div>
    </>
  )
}

export default MypageInterest