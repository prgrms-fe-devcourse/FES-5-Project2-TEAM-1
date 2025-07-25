import { useState, type ChangeEvent } from 'react';
import type { User } from './Mypage';
import S from './MypageTop.module.css';
import E from './MypageEdit.module.css';
import supabase from '../../supabase/supabase';


interface Props {
    user: User | null;
    editMode: boolean;
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
    showEdit: boolean,
    setShowEdit: (value: boolean) => void;
}

function MypageName({ user, editMode, setUserData, showEdit, setShowEdit}: Props) {

  if( !user ) {
    return <p>프로필 정보가 없습니다.</p>;
  }

  const [userName, setUserName] = useState<string>(user.name);
  const [role, setRole] = useState<string>(user.role);

    const handleEditName = () => {
      setShowEdit(true);
    }

    const handleSaveBtn = async () => {

      if( typeof userName !== 'string' || !userName?.trim() ) {
        alert('올바른 이름 을 입력해주세요.');
        return;
      }

      // const validRoles = ['프론트엔드', '백엔드', '데이터 엔지니어', '생성형 AI 백엔드', '데이터 분석'];

      // if( !validRoles.includes(role) ) {
      //   alert('올바른 직무를 선택해주세요.');
      //   return;
      // }

      const { id } = user;

      const { error: nameError } = await supabase
        .from('user_base')
        .update({name: userName})
        .eq('id', id);

      if( nameError ) {
          console.error('DB 업데이트 실패!!', nameError );
          return;
      }

      const { error: roleError } = await supabase
        .from('user_base')
        .update({role: role})
        .eq('id', id);

      if( roleError ) {
        console.error('DB 업데이트 실패', roleError);
        return;
      }

      if( typeof userName !== 'string' ) return;
      if( typeof role !== 'string' ) return;

      setUserData((prev) => {
            if( !prev ) return prev

            return {
                ...prev,
                name: userName,
                role: role
            }
        })
      
      alert('성공적으로 업로드가 완료되었습니다~!');
      setShowEdit(false);
    }

    const handleInputChange = ( e:ChangeEvent<HTMLInputElement> ) => {
      const name = e.currentTarget.value.trim();
      setUserName( name );
    }

    const handleSelectChange = ( e:ChangeEvent<HTMLSelectElement> ) => {
      setRole( e.currentTarget.value );
    }

    const handleCancelBtn = () => {
      const result = confirm('변경하지 않고 나가시겠습니까?');
      if( result ) {
        setShowEdit(false);
      }
    }

    if( !editMode ) {
      setShowEdit(false);
    }


  return (
    <div className={S.mypageNameContainer}>
      { editMode && 
        showEdit ? 
          <div className={E.editNamecontainer}>
            <input type='text' placeholder={userName}  onChange={handleInputChange} />
            <select onChange={handleSelectChange} defaultValue={role}>
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
                <button onClick={handleCancelBtn}>취소</button>
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