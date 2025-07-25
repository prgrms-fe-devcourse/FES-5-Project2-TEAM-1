
import { useState, type ChangeEvent } from 'react';
import type { User } from './Mypage';
import S from './MypageTop.module.css';
import E from './MypageEdit.module.css';


interface Props {
  user: User | null;
}

interface Props {
    user: User | null;
    editMode: boolean;
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

function MypageName({ user, editMode, setUserData }: Props) {

  const [showEdit, setShowEdit] = useState(false);
  const [userName, setUserName] = useState(user?.name);
  const [role, setRole] = useState(user?.role);

   if( !user ) {
      return <p>프로필 정보가 없습니다.</p>;
    }

    const handleEditName = () => {
      setShowEdit(true);
    }

    const handleSaveBtn = async () => {

      setShowEdit(false);
    }

    const handleInputChange = ( e:ChangeEvent<HTMLInputElement> ) => {
      const name = e.currentTarget.value.trim();
        setUserName( name );
    }

    const handleSelectChange = ( e:ChangeEvent<HTMLSelectElement> ) => {
      setRole( e.currentTarget.value );
    }


  return (
    <div className={S.mypageNameContainer}>
      { showEdit ? 
        <div className={E.editNamecontainer}>
          <input type='text' placeholder={userName}  onChange={handleInputChange} />
          <select onChange={handleSelectChange}>
            <option>분야를 선택해주세요.</option>
            <option value="프론트엔드">프론트엔드</option>
            <option value="백엔드">백엔드</option>
            <option value="데이터 엔지니어">데이터 엔지니어</option>
            <option value="생성형 AI 백엔드">생성형 AI 백엔드</option>
            <option value="데이터 분석">데이터 분석</option>
          </select>
        </div>
        : (
        <div className={S.mypageNameRole}>
          <span className={S.mypageName}>
            {userName}
          </span>
          <span className={S.mypageRole}>
            {role}
          </span>
        </div>
        )}

        {editMode && (
          showEdit ? (
            <div className={E.editNameBtn}>
                <button onClick={handleSaveBtn}>저장</button>
            </div>

          ) : (
            <div className={S.mypageNameEdit}>
              <button
                type='button'
                onClick={handleEditName}
              >
                <img src='/icons/edit_pencil.svg' />
              </button>
            </div>
          )
        )}
    </div>
  );
}

export default MypageName