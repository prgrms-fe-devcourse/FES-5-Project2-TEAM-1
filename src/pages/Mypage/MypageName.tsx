import { useEffect, useState, type ChangeEvent, type MutableRefObject } from 'react';
import type { User } from './Mypage';
import S from './MypageTop.module.css';
import E from './MypageEdit.module.css';
import supabase from '../../supabase/supabase';
import { useToast } from '@/utils/useToast';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { showConfirmAlert } from '@/utils/sweetAlert';


interface Props {
    user: User | null;
    editMode: boolean;
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
    canExitEditModeRef?: MutableRefObject<() => boolean>;
}

function MypageName({ user, editMode, setUserData, canExitEditModeRef}: Props) {

  const { error } = useToast();

  const [userName, setUserName] = useState({
    current: '', // 지금
    original: '' // 처음
  });
  const [role, setRole] = useState<string>('');
  const [showEdit, setShowEdit] = useState(false);
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
        const nickname = (userData.nickname ?? '').trim();
        const original = nickname || '';

        const role = (userData.role ?? '').trim();

        setUserName({
          current: nickname || '',
          original: original
        });
        setRole(role || '프론트엔드');
      }

  };

  fetchUserInfo();

  }, [profileId]);

  useEffect(() => {
    if (canExitEditModeRef) {
      canExitEditModeRef.current = () => {
        const trimmedCurrent = userName.current.trim();
        const trimmedOriginal = userName.original.trim();
        return !!(trimmedCurrent || trimmedOriginal); // 둘 다 없으면 false
      };
    }
  }, [userName]);

    const handleEditName = () => {
      setShowEdit(true);
    }

    const handleSaveBtn = async () => {
      const trimmedCurrent = userName.current.trim();
      const trimmedOriginal = userName.original.trim();
      const nameToSave = trimmedCurrent || trimmedOriginal;

      if (!nameToSave) {
        error('이름을 입력해주세요.');
        return;
      }

      if (nameToSave.length > 5) {
        error('5글자 이하로 적어주세요.');
        return;
      }

      if(!user) return 
      const { id } = user;

      const { error: nameError } = await supabase
        .from('user_base')
        .update({nickname: nameToSave})
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

      setUserName({
        current: nameToSave,
        original: nameToSave
      })

      setUserData((prev) => {
            if( !prev ) return prev

            return {
                ...prev,
                nickname: nameToSave,
                role: role
            }
        })
      
      toast.info('성공적으로 저장되었습니다.', { autoClose: 1500});
      setShowEdit(false);
    }

    const handleInputChange = ( e:ChangeEvent<HTMLInputElement> ) => {
      const name = e.currentTarget.value;
      setUserName((prev) => ({
        ...prev,
        current: name
      }));
    }

    const handleSelectChange = ( e:ChangeEvent<HTMLSelectElement> ) => {
      setRole( e.currentTarget.value );
    }

    const handleCancelBtn = async () => {
      const result = await showConfirmAlert('변경하지 않고 나가시겠습니까?');
      if( !result.isConfirmed ) return;

      const safeName = userName.current.trim() || userName.original.trim();

      if (!safeName) {
        toast.error('이름이 없습니다.');
        return;
      }

      setUserName((prev) => ({
        ...prev,
        current: prev.original, // 취소 시 원래값으로 복원
      }));
      setShowEdit(false);
    }

    const handleEmptyValue = () => {
      setUserName((prev) => ({
        ...prev,
        current: '',
      }));
    }


  return (
    <div className={S.mypageNameContainer}>
      { editMode && 
        showEdit ? 
          <div className={E.editNamecontainer}>
            <input type='text' value={userName.current} placeholder={userName.original || '프둥이'}  onChange={handleInputChange} onClick={handleEmptyValue} />
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
            {userName.original || '프둥이'}
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