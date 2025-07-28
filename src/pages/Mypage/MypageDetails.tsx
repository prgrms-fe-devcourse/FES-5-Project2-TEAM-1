import type { User } from './Mypage'
import S from './MypageTop.module.css'
import Edit from '/icons/edit_pencil.svg';
import E from './MypageEdit.module.css';
import { useEffect, useState } from 'react';
import Eye from '/icons/eye.svg';
import Closed from '/icons/closed_eye.svg';
import DaumPostcodeEmbed from 'react-daum-postcode';
import supabase from '@/supabase/supabase';
import { useToast } from '@/utils/useToast';


interface Props {
    user: User | null;
    editMode: boolean,
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

interface DaumPostcodeData {
    address: string;
    addressType: 'R' | 'J';
    bname: string;
    buildingName: string;
    zonecode: string;
    roadAddress: string;
    jibunAddress: string;
    userSelectedType: 'R' | 'J';
    autoRoadAddress: string;
    autoJibunAddress: string;
    apartment: 'Y' | 'N';
    sigunguCode: string;
    buildingCode: string;
}

type Visibility = {
    address: boolean,
    age: boolean,
    gender: boolean
}

function MypageDetails({ user, editMode, setUserData}: Props) {

    const { success, error } = useToast();

    const [showEdit, setShowEdit] = useState(false);
    const [hide, setHide] = useState<Visibility>(user.profile[0].visibility);
    const [address, setAddress] = useState(user?.profile[0].address);
    const [gender, setGender] = useState('');
    const [isClicked, setIsClicked] = useState(false);

    const today = new Date();
    const yearNow = today.getFullYear();

    const [year, setYear] = useState( yearNow );
    const [month, setMonth] = useState(1);
    const [day, setDay] = useState(1);

    useEffect(() => {
        if( !editMode ) {
            setShowEdit(false);
        }
    }, [editMode])

    const userData = user && user.profile[0];
    if( !userData ) {
        return <div className={S.mypageDetailsContainer}>Loading...</div>;
    }

    const handleEditDetail = () => {
        setShowEdit(true);
    }

    const handleCloseDetail = () => {
        const message = confirm('저장하지 않고 나가시겠습니까?');
        if( message ) {
            setShowEdit(false);
        }
        setIsClicked(false);
    }

    console.log( gender );

    const handleSaveDetail = async () => {

        if ( !user.profile[0] ) return;

        const calculatedAge = calculateAge();

        if( gender === '선택' ) {
            error('성별을 선택해주세요!');
            return;
        }

        const { profile_id } = user.profile[0];
        const { error: detailError } = await supabase
            .from('user_profile')
            .update({
                address: address,
                gender: gender,
                age: calculatedAge,
                visibility: hide
            })
            .eq('profile_id', profile_id);

        if( detailError ) {
            error('업데이트 실패!');
            return;
        }

        setUserData((prev) => {
            if( !prev ) return prev;

            return {
                ...prev,
                profile: [{
                    ...prev.profile[0],
                    address: address ?? '',
                    gender: gender,
                    age: calculatedAge,
                    visibility: hide
            }]
            }
        })

        success('업로드 성공!');
        setShowEdit(false);
        setIsClicked(false);
    }

    const handleHideToggle = ( key: keyof Visibility ) => {
        setHide(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    }

    const handleGender = ( e: React.ChangeEvent<HTMLSelectElement>) => {
        setGender( e.currentTarget.value );
    }

    const handleYear = ( e: React.ChangeEvent<HTMLInputElement> ) => {
        setYear(Number(e.currentTarget.value));
    }

    const handleMonth = ( e: React.ChangeEvent<HTMLSelectElement>) => {
        setMonth( Number(e.currentTarget.value) );
    }

    const addDayOption = () => {
        const lastDay = new Date(year, month, 0).getDate();

        return Array.from({ length: lastDay }, (_, i) => i + 1);
    }

    const handleDay = (e: React.ChangeEvent<HTMLSelectElement> ) => {
        setDay( Number(e.currentTarget.value) ); 
    }

    const calculateAge = () => {
        let age = yearNow - year;

        const monthDiff = (today.getMonth() + 1) - month;
        const dayDiff = today.getDate() - day;

        if( monthDiff < 0 || (monthDiff === 0 && dayDiff < 0 )) {
            age--;
        }

        return age;
    }

    const handleComplete = ( data: DaumPostcodeData ) => {
        const { address } = data;
        setAddress( address );
    }

    const themeObj = {
        bgColor: '#A6B37D'
    }

    const postCodeStyle = {
        position: 'absolute',
        width: '40rem',
        border: '2px solid #A6B37D',
        top: '2.2rem',
    } as React.CSSProperties

  return (
    <div className={S.mypageDetailsContainer}>
        { showEdit ?
        <ul>
            <li>
                <h3>주소</h3>
                <div className={E.editDetailAddress}>
                    <div>
                        <span>{address}</span>
                        <button 
                            onClick={() => setIsClicked(prev => !prev)}
                            className={E.editDetailAddressBtn}
                         >주소찾기</button>
                    </div>
                     <button onClick={() => handleHideToggle('address')}>
                        { hide.address
                            ? <img src={Closed} />
                            :  <img src={Eye} />
                        }
                    </button>
                    { isClicked &&  <DaumPostcodeEmbed 
                            onComplete={handleComplete} 
                            theme={themeObj}
                            style={postCodeStyle} 
                        /> 
                     }
                </div>
            </li>
            <li>
                <h3>성별</h3>
                <div className={E.editDetailGender}>
                    <select onChange={handleGender}>
                        <option value='선택'>성별을 선택해주세요.</option>
                        <option value='여성'>여성</option>
                        <option value='남성'>남성</option>
                    </select>
                    <button onClick={() => handleHideToggle('gender')}>
                        { hide.gender
                            ? <img src={Closed} />
                            :  <img src={Eye} />
                        }
                    </button>
                </div>
            </li>
            <li>
                <h3>나이</h3>
                <div className={E.editDetailAge}>
                    <div>
                        <input type='number' value={year} min={1900} max={yearNow} placeholder='태어난 해' onChange={handleYear} />
                        <select onChange={handleMonth}>
                            <option value='' key='0'>태어난 달을 선택해주세요.</option>
                            {Array.from({ length: 12}, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>
                        <select onChange={handleDay}>
                            <option>태어난 날을 선택해주세요.</option>
                            {addDayOption().map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={() => handleHideToggle('age') }>
                        { hide.age
                            ? <img src={Closed} />
                            :  <img src={Eye} />
                        }
                    </button>
                </div>
            </li>
        </ul>
        : (
            <ul>
                <li>
                    <h3>주소</h3>
                    { hide.address
                        ? <p>비밀</p>
                        : <p>{userData.address}</p>
                    }
                </li>
                <li>
                    <h3>성별</h3>
                    { hide.gender
                        ? <p>비밀</p>
                        : <p>{userData.gender}</p>
                    }
                </li>
                <li>
                    <h3>나이</h3>
                    { hide.age
                        ? <p>비밀</p>
                        : <p>{userData.age}</p>
                    }
                </li>
            </ul>
        )
        }
        { editMode && (
            showEdit ? (
                <div className={E.editDetailSaveClose}>
                    <button onClick={handleSaveDetail}>저장</button>
                    <button onClick={handleCloseDetail}>취소</button>
                </div>
            )
            : (
            <div className={S.mypageDetailEdit}>
                <button
                    type='button'
                    onClick={handleEditDetail}    
                >
                    <img src={Edit} />
                </button>
            </div>
            )
        )}
    </div>
  )
}

export default MypageDetails