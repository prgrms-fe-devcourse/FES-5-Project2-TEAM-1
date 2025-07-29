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

interface Props {
  user: User | null;
  editMode: boolean,
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

function MypageInterest({user, editMode, setUserData}: Props) {

  const [interests, setInterests] = useState<string[] | undefined>(user?.profile[0].interest[0].interest.split(','));
  const [isFive, setIsFive] = useState(false);
  const [plusClicked, setPlusClicked] = useState(false);

  const minusRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const divRefs = useRef<(HTMLDivElement | null)[]>([]);
  const divRef = useRef<HTMLDivElement | null>(null);
 
  const userInterest = user && user.profile[0].interest[0];
  // const interestArray = userInterest.interest.split(',')
  const { success, error } = useToast();



  useEffect(() => {
    if( interests && interests.length >= 5 ) {
      setIsFive(true);
    } else {
      setIsFive(false);
    }

    gsap.from(divRef.current, {
      x: 10,
      opacity: 0,
      duration: 0.3,
      ease: 'power1.out',
    })

  }, [interests])

  useEffect(() => {
    const validElements = minusRefs.current.filter(el => el !== null) as HTMLButtonElement[];
    if( validElements.length > 0 ) {
      gsap.from(validElements, {
        y: -10,
        opacity: 0,
      });
    }
  }, [editMode])

  if( !userInterest ) {
    return <div className={S.mypageInterest}>Loading...</div>;
  }

  const handlePlusInterest = () => {
    setPlusClicked(true);
  }

  const handleMinus = async ( index: number) => {

      const text = divRefs.current[index]?.textContent;
      const { profile_id } = userInterest;

      if( !interests) return;
      const newInterests = interests.filter(el => el !== text );
      setInterests(newInterests);
  
      const { error: minusError } = await supabase
        .from('user_interest')
        .update({interest: newInterests.join(',')})
        .eq('profile_id', profile_id)
  
     if( minusError ) {
      error('업로드 실패!');
      return;
     }

     setUserData((prev) => {
            if( !prev ) return prev;

            const prevInterest = prev.profile[0].interest?.[0] || {};

            return {
                ...prev,
                profile: [{
                     ...prev.profile[0],
                     interest: [{
                        ...prevInterest,
                        interest: newInterests.join(',')
                     }]
                }]
            }
        })

        success('관심사 제거 성공!');

    }

    console.log( interests );


  return (
    <>
        <div className={S.mypageInterest}>
          <h2>관심분야</h2>
          { editMode 
            ? <div className={S.InterestBlock}>
              { interests && interests.map((interest, index) => (
                <div key={index} className={E.editInterestBlockWrapper}>
                  <div
                    key={index}
                    ref={(el) => { divRefs.current[index] = el }}
                    className={S.InterestBlockEach}
                  >
                      {interest}
                  </div>
                    <button 
                      ref={(el) => {minusRefs.current[index] = el}}
                      className={E.editInterestMinusBtn}
                      onClick={() => handleMinus( index)}
                    >
                      <img src={minus} alt='마이너스 버튼 아이콘' />
                    </button>
                  </div>
              ))}
                { !isFive && 
                    <div ref={divRef} className={S.InterestBlockEach}>
                      { plusClicked 
                        ? 
                        <InterestDropdown
                            setPlusClicked={setPlusClicked}
                            userInterest={userInterest}
                            setUserData={setUserData}
                            user={user}
                            interests={interests}
                            setInterests={setInterests}
                            />
                        : <>           
                            <button
                              className={E.editInterestPlusBtn}
                              onClick={handlePlusInterest}
                            >
                              <img src={plus} alt='플러스 버튼 아이콘' />
                            </button>
                          </>
                        }
                      </div>
                    }
              </div>  
            : 
            <div className={S.InterestBlock}>
                { interests && interests.map((i, idx) => (
                  <div key={idx}>
                    <div className={S.InterestBlockEach}>{i}</div>
                  </div>
                ))}
            </div>  
          }
        </div>
    </>
  )
}

export default MypageInterest