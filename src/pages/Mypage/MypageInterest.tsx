import type { User } from './Mypage';
import S from './MypageTop.module.css';
import E from './MypageEdit.module.css';
import minus from '/icons/minus.svg';
import plus from '/icons/plus.svg';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import InterestDropdown from './components/InterestDropdown';

interface Props {
  user: User | null;
  editMode: boolean,
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

function MypageInterest({user, editMode, setUserData}: Props) {

  const [interests, setInterests] = useState('');
  const [isFive, setIsFive] = useState(false);
  const [plusClicked, setPlusClicked] = useState(false);

  const minusRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const userInterest = user && user.profile[0].interest[0];
  if( !userInterest ) {
    return <div className={S.mypageInterest}>Loading...</div>;
  }

  const interestArray = userInterest.interest.split(',');

  if( interestArray.length >= 5 ) {
    setIsFive(true);
  }

  const handlePlusInterest = () => {
    setPlusClicked(true);
  }
  

  return (
    <>
        <div className={S.mypageInterest}>
          <h2>관심분야</h2>
          { editMode 
            ? <div className={S.InterestBlock}>
              { interestArray.map((interest, index) => (
                <div key={index} className={E.editInterestBlockWrapper}>
                  <div className={S.InterestBlockEach}>
                      {interest}
                  </div>
                    <button 
                      ref={(el) => {minusRefs.current[index] = el}}
                      className={E.editInterestMinusBtn}
                    >
                      <img src={minus} alt='마이너스 버튼 아이콘' />
                    </button>
                  </div>
              ))}
                { !isFive && 
                    <div className={S.InterestBlockEach}>
                      { plusClicked 
                        ? 
                        <InterestDropdown
                            plusClicked={plusClicked}
                            setPlusClicked={setPlusClicked}
                            userInterest={userInterest}
                            setUserData={setUserData}
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
                { interestArray && interestArray.map((i, idx) => (
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