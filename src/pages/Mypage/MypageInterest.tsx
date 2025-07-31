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

  const [interestArray, setInterestArray] = useState<Interest[] | null>(null);
  const [isFive, setIsFive] = useState(false);
  const [plusClicked, setPlusClicked] = useState(false);
  const [fontSize, setFontSize] = useState<string>('');

  const minusRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const divRefs = useRef<(HTMLDivElement | null)[]>([]);
  const divRef = useRef<HTMLDivElement | null>(null);
 
  const userInterest = user && user.profile[0].interest[0];
  // const interestArray = userInterest.interest.split(',')
  const { success, error } = useToast();
    const navigate = useNavigate();

  useEffect(() => {
    
    const fetchInterest = async () => {
      if( !userInterest ) return;
      const result = await compareUserId(userInterest.profile_id, 'user_interest');
      setInterestArray(result);
    }

    fetchInterest();

    gsap.from(divRef.current, {
      x: 10,
      opacity: 0,
      duration: 0.3,
      ease: 'power1.out',
    })

  }, [userInterest])

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

      if( !interestArray) return;

      const text = divRefs.current[index]?.textContent;
      const { profile_id } = userInterest;
      const { interest_id, interest } = interestArray[index];

      setInterestArray((prev) => {
        if( !prev ) return prev;
        return prev.filter((_, i) => !(i === index && prev[i].interest == text)); 
      })
  
      const { error: minusError } = await supabase
        .from('user_interest')
        .delete()
        .match({
          'profile_id': profile_id,
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
          navigate(`/mypage/${userInterest?.profile_id}`)
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
                      onClick={() => handleMinus( index)}
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
                            setPlusClicked={setPlusClicked}
                            userInterest={userInterest}
                            setUserData={setUserData}
                            user={user}
                            interestArray={interestArray}
                            setInterestArray={setInterestArray}
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
                { interestArray && interestArray.map((i) => {
                const fontSize =
                  i.interest.length > 15 ? '0.8rem' :
                  i.interest.length > 12 ? '0.9rem' :
                  '';
                return(
                    <div key={i.interest_id}>
                      <div className={S.InterestBlockEach}  style={fontSize ? {fontSize} : undefined}>{i.interest}</div>
                    </div>
                  )})}
            </div>  
          }
        </div>
    </>
  )
}

export default MypageInterest