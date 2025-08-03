import { useEffect, useState, type ChangeEvent } from 'react';
import type { User } from './Mypage';
import S from './MypageTop.module.css';
import E from './MypageEdit.module.css';
import supabase from '../../supabase/supabase';
import { useToast } from '@/utils/useToast';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';


interface Props {
    user: User | null;
    editMode: boolean;
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

function MypageName({ user, editMode, setUserData}: Props) {

  const { error } = useToast();

  const [userName, setUserName] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [showEdit, setShowEdit] = useState(false);
  const navigate = useNavigate();
  const { id: profileId } = useParams<{id: string}>();

  useEffect(() => {
      if( !editMode ) {
        setShowEdit(false);
      }
  }, [editMode]);

  useEffect(() => {
    
    const fetchUserInfo = async () => {
      const { data: profileData } = await supabase
        .from('user_profile')
        .select('user_id')
        .eq('profile_id', profileId)
        .single();

      if (!profileData) return;

      const { data: userData } = await supabase
        .from('user_base')
        .select('nickname, role')
        .eq('id', profileData.user_id)
        .single();

      if (userData) {
         setUserName(userData.nickname);
         setRole(userData.role);
      }

  };

  fetchUserInfo();

  }, [profileId]);

    const handleEditName = () => {
      setShowEdit(true);
    }

    const handleSaveBtn = async () => {

      if( typeof userName !== 'string' || !userName?.trim() ) {
        error('이름 입력을 다시해주세요.')
        return;
      }

      if( userName.length > 5 ) {
        error('5글자 이하로 적어주세요.')
        return;
      }

      if(!user) return 
      const { id } = user;

      const { error: nameError } = await supabase
        .from('user_base')
        .update({nickname: userName})
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
                nickname: userName,
                role: role
            }
        })
      
      toast.info('성공적으로 저장되었습니다.', { onClose() {
          navigate(`/mypage/${user?.profile[0]?.profile_id}`)
        }, autoClose: 1500})
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
              <option value="">분야를 선택해주세요.</option>
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