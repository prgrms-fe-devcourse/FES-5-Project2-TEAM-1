import { useEffect, useRef, useState } from 'react';
import S from './InterestDropdown.module.css';
import back from '/icons/back.svg';
import interestData from '@/components/data/interestData.json';
import type { User } from '../Mypage';
import type { Tables } from '@/supabase/database.types';
import { useToast } from '@/utils/useToast';
import supabase from '@/supabase/supabase';
import compareUserId from '@/utils/compareUserId';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';



interface Props {
    plusClicked: boolean,
    setPlusClicked: (value: boolean) => void;
    userInterest: { profile_id: string } | null; 
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
    user: User | null,
    interestArray: Interest[] | null;
    setInterestArray: React.Dispatch<React.SetStateAction<Interest[] | null>>;
}

type Interest = Tables<'user_interest'>;

function InterestDropdown({ plusClicked, setPlusClicked, userInterest, setUserData, interestArray, setInterestArray }: Props) {

    const [isTyping, setIsTyping] = useState(false);
    const [filteredInterest, setFilteredInterest] = useState<string[]>([]);
    const [ fontSize, setFontSize] = useState<string>('');

    const ulRef = useRef<HTMLUListElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();
    const { error } = useToast();

    useEffect(() => {
        const fetchInterest = async () => {
            if( !userInterest?.profile_id ) return;
            const result = await compareUserId(userInterest.profile_id, 'user_interest');
            setInterestArray(result || []);
        }

        fetchInterest();
    }, [userInterest, setInterestArray])

    useEffect(() => {
        gsap.fromTo('#btnBox', 
            { x: 10, opacity: 0 },
            {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            clearProps: 'transform,opacity', // opacity도 지워줌
            }
        )   
    }, [plusClicked])

    const filterInterest = ( value: string) => {

        if( value === '' ) setIsTyping(false);

        const result = interestData.filter(interest => interest.toLowerCase().includes(value.toLowerCase().trim()));
        return result
    }

    const handleInputChange = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        const value = e.currentTarget.value.trim(); 
        console.log( value.length );
        if( value.length > 15 ) {
            setFontSize('0.7rem')
        } else if( value.length > 10) {
            setFontSize('0.8rem')
        } else {
            setFontSize('');
        }

        // setInterest([ value ]);
        setIsTyping(true);
        setFilteredInterest(filterInterest(value));
        
    }

    const handleFilteredInterest = ( e: React.MouseEvent<HTMLLIElement> ) => {
        const text = e.currentTarget.textContent;
        if (text && inputRef.current) {
            inputRef.current.value = text;

            if(text.length > 15 ) {
                setFontSize('0.7rem')
            } else if( text.length > 10 ) {
                setFontSize('0.8rem')
            } else {
                setFontSize('')
            }
            setIsTyping(false);
        }
    }

    const handleInterestSave = async () => {

        if (!inputRef.current) return;
        if (!userInterest?.profile_id) {
            error('프로필 정보를 불러올 수 없습니다.');
            return;
        }

        const value = inputRef.current.value.trim();
        const profile_id = userInterest.profile_id;

         const currentInterests = interestArray ?? [];

        const lowerInterest = currentInterests.map(i => i.interest.toLowerCase());
        if (lowerInterest.includes(value.toLowerCase())) {
            error('관심사 중복!');
            return;
        }

        if (currentInterests.length >= 5) {
            error('관심사는 최대 5개까지 추가할 수 있어요!');
            return;
        }

        if (value.length === 0) {
            error('관심사를 입력해주세요!');
            return;
        }

        const { data, error: insertError } = await supabase
            .from('user_interest')
            .insert([
                {
                    profile_id,
                    interest: value
                }
            ])
            .select()
            .single();
        
        if( insertError ) {
            error('추가 실패');
            return;
        }

        setInterestArray((prev) => (prev ? [...prev, data] : [data]));
        setUserData((prev) => {
            if( !prev ) return prev;

            const newInterest = [...(prev.profile[0].interest || []), data];
            return {
                ...prev,
                profile: [{
                    ...prev.profile[0],
                    interest: newInterest
                }]
            }
        });

        toast.info('관심사가 추가되었습니다.', { onClose() {
                  navigate(`/mypage/${userInterest?.profile_id}`)
                }, autoClose: 1500});

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
            style={fontSize ? {fontSize} : undefined}
        />
        <div className={S.interestBackSave} id='btnBox'>
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
