import type { User } from './Mypage'
import S from './MypageTop.module.css'
import Edit from '/icons/edit_pencil.svg';
import E from './MypageEdit.module.css';
import { useEffect, useState } from 'react';


interface Props {
    user: User | null;
    editMode: boolean,
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

function MypageDetails({ user, editMode, setUserData}: Props) {

    const [showEdit, setShowEdit] = useState(false);

    useEffect(() => {

    })

    const userData = user && user.profile[0];
    if( !userData ) {
        return <div className={S.mypageDetailsContainer}>Loading...</div>;
    }

    const handleEditDetail = () => {
        setShowEdit(true);
    }

    const handleCloseDetail = () => {
        setShowEdit(false);
    }

    const handleSaveDetail = () => {
        
    }

  return (
    <div className={S.mypageDetailsContainer}>
        { showEdit ?
        <ul>
            <li>
                <h3>주소</h3>
                <p></p>
            </li>
            <li>
                <h3>성별</h3>
                <div>
                    <select>
                        <option></option>
                        <option value='여성'>여성</option>
                        <option value='남성'>남성</option>
                    </select>
                </div>
            </li>
            <li>
                <h3>나이</h3>
                <p></p>
            </li>
        </ul>
        : (
            <ul>
                <li>
                    <h3>주소</h3>
                    <p>{userData.address}</p>
                </li>
                <li>
                    <h3>성별</h3>
                    <p>{userData.gender}</p>
                </li>
                <li>
                    <h3>나이</h3>
                    <p>{userData.age}</p>
                </li>
            </ul>
        )
        }
        { editMode && (
            showEdit ? (
                <div>
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