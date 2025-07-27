import { useEffect, useState, type ChangeEvent } from 'react';
import type { User } from './Mypage';
import S from './MypageTop.module.css';
import E from './MypageEdit.module.css';
import supabase from '../../supabase/supabase';
import { useToast } from '@/utils/useToast';


interface Props {
    user: User | null;
    editMode: boolean;
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

function MypageName({ user, editMode, setUserData}: Props) {

  const { success, error } = useToast();

  const [userName, setUserName] = useState<string>(user?.name ?? '');
  const [role, setRole] = useState<string>(user?.role ?? '');
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
      if( !editMode ) {
        setShowEdit(false);
      }
  }, [editMode]);

  if( !user ) {
    return <p>프로필 정보가 없습니다.</p>;
  }

    const handleEditName = () => {
      setShowEdit(true);
    }

    const handleSaveBtn = async () => {

      if( typeof userName !== 'string' || !userName?.trim() ) {
        error('이름 입력을 다시해주세요.')
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
          error('업데이트 실패')
          return;
      }

      const { error: roleError } = await supabase
        .from('user_base')
        .update({role: role})
        .eq('id', id);

      if( roleError ) {
        error('업데이트 실패')
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
      
      success('저장 성공!');
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