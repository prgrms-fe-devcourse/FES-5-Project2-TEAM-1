import { useEffect, useRef, useState } from 'react';
import S from './InterestDropdown.module.css';
import back from '/icons/back.svg';
import interestData from '@/components/data/interestData.json';
import type { User } from '../Mypage';
import type { Tables } from '@/supabase/database.types';



interface Props {
    plusClicked: boolean,
    setPlusClicked: (value: boolean) => void;
    userInterest: Tables<'user_interest'>;
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}


function InterestDropdown({ plusClicked, setPlusClicked, userInterest, setUserData }: Props) {

    const [interest, setInterest] = useState<string[]>(userInterest.interest.split(','));
    const [isTyping, setIsTyping] = useState(false);
    const [filteredInterest, setFilteredInterest] = useState<string[]>([]);

    const ulRef = useRef<HTMLUListElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {

        console.log( interest );
    }, [interest]);

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
        inputRef.current.value = text;
        setIsTyping(false);
    }

    const handleInterestSave = () => {

        const value = inputRef.current.value.trim();
        if( !value ) return;

        setInterest((prev)=> {
            console.log( prev );
            return prev;
        });

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
