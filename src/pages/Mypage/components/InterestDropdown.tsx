import { useRef, useState } from 'react';
import S from './InterestDropdown.module.css';
import back from '/icons/back.svg';
import interestData from '@/components/data/interestData.json';
import type { User } from '../Mypage';
import type { Tables } from '@/supabase/database.types';
import { useToast } from '@/utils/useToast';
import supabase from '@/supabase/supabase';



interface Props {
    setPlusClicked: (value: boolean) => void;
    userInterest: Tables<'user_interest'>;
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
    user: User | null,
    interests: string[] | undefined,
    setInterests: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}


function InterestDropdown({ setPlusClicked, userInterest, setUserData, interests, setInterests }: Props) {

    const [isTyping, setIsTyping] = useState(false);
    const [filteredInterest, setFilteredInterest] = useState<string[]>([]);

    const ulRef = useRef<HTMLUListElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const { success, error } = useToast();

    const filterInterest = ( value: string) => {

        if( value === '' ) setIsTyping(false);

        const result = interestData.filter(interest => interest.toLowerCase().includes(value.toLowerCase().trim()));
        return result
    }

    const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const value = e.currentTarget.value.trim(); 

        // setInterest([ value ]);
        setIsTyping(true);
        setFilteredInterest(filterInterest(value));
        
    }

    const handleFilteredInterest = ( e: React.MouseEvent<HTMLLIElement> ) => {
        const text = e.currentTarget.textContent;
        if (text && inputRef.current) {
            inputRef.current.value = text;
            // handleAdd(text);
            setIsTyping(false);
        }
    }

    const handleInterestSave = async () => {

        if (!inputRef.current) return;
        if( !interests ) return;
        const value = inputRef.current.value.trim();

        const lowerInterest = interests.map(i => i.toLowerCase());
        if (lowerInterest.includes(value.toLowerCase())) {
            error('관심사 중복!');
            return;
        }

        if (interests.length >= 5) {
            error('관심사는 최대 5개까지 추가할 수 있어요!');
            return;
        }

        // 여기서 새 배열을 먼저 계산
        const updatedInterests = [...interests, value];

        // 상태 업데이트
        setInterests(updatedInterests);

        const { profile_id } = userInterest;
        const { error: addError } = await supabase
            .from('user_interest')
            .update({interest: interests.join(',')})
            .eq('profile_id', profile_id);
        
        if( addError ) {
            error('업로드 실패');
            console.error(addError);
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
                        interest: interests.join(',')
                     }]
                }]
            }
        })

        success('관심사 추가 성공!');
        if( inputRef.current ) {
             inputRef.current.value = '';
        }
        setPlusClicked(false);
    }
    
  return (
    <>
    <div style={{width: '100%', height: '100%', position: 'relative'}}>
        <input 
            ref={inputRef}
            type='text' 
            className={S.interestInput}
            onChange={handleInputChange} 
        />
        <div className={S.interestBackSave}>
            <button 
                className={S.interestBackBtn}
                onClick={() => setPlusClicked(false) }
            >
                <img src={back} />    
            </button> 
            <button 
                type='button' 
                className={S.interestSaveBtn}
                onClick={handleInterestSave}
            >저장</button>
        </div>
        { isTyping &&
            <div className={S.dropdown}>
                <ul ref={ulRef} >
                    { filteredInterest.map((item, index) => (
                        <li key={index} onClick={handleFilteredInterest}>{item}</li>
                    ))}
                </ul>
            </div>
        }
    </div>
    </>
  )
}

export default InterestDropdown
