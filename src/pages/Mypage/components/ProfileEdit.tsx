

import type { Tables } from 'src/supabase/database.types';
import S from './ProfileEdit.module.css';
import closeBtn from '/icons/edit_close.svg';
import type { User } from '../Mypage';
import { useRef, useState } from 'react';
import Default_profile from '/images/default_cover.png';
import supabase from '../../../supabase/supabase';
import { useToast } from '@/utils/useToast';


interface Props {
    prevProfileImage: string,
    setPrevProfileImage: (value: string) => void;
    setShowProfileDrop: (value: boolean) => void;
    profileData: Tables<'user_profile'>;
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

function ProfileEdit({ prevProfileImage, setPrevProfileImage, setShowProfileDrop, profileData, setUserData}: Props) {

    const { success, error } = useToast();

    const [file, setFile] = useState<File | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFileUpload = () => {
        inputRef.current?.click();
    }

    const handleFileChange = ( e: React.ChangeEvent<HTMLInputElement>) => {
        const profileFiles = e.currentTarget.files;

        if( profileFiles && profileFiles.length > 0 ) {
            const lastFile = profileFiles[profileFiles.length - 1];
            setFile(lastFile);
            setPrevProfileImage( URL.createObjectURL(lastFile) );
        } else {
            setFile(null);
            setPrevProfileImage( prevProfileImage );
        }

         if( inputRef.current ) {
            inputRef.current.value = '';
        }

    }

    const handleFileApply = async () => {


        if( !file || !profileData ) return;

        const { profile_id } = profileData;
        const fileName = `${profile_id}-profile-${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
            .from('profileimages')
            .upload(`profile/${fileName}`, file);
        
        if( uploadError ) {
            error('업로드 실패!');
            return;
        }

         // 파일 URL 생성
         // https://zugionbtbljfyuybihxk.supabase.co/storage/v1/object/sign/profileimages/profile/e564cf92-7719-43db-9803-100bd6cf23f6-profile-1753406175294.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83YTU2MjIwNi05MTIxLTRjOWMtYTViZS02OTIxZWJjY2QyZjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9maWxlaW1hZ2VzL3Byb2ZpbGUvZTU2NGNmOTItNzcxOS00M2RiLTk4MDMtMTAwYmQ2Y2YyM2Y2LXByb2ZpbGUtMTc1MzQwNjE3NTI5NC5qcGciLCJpYXQiOjE3NTM0MDYwOTcsImV4cCI6MTc1NDAxMDg5N30.p3LJQ3y4zaLXOo-4mQjz7n3SzsxMgJDiwHICrZkGyVU
        const imageUrl = `https://zugionbtbljfyuybihxk.supabase.co/storage/v1/object/public/profileimages/profile/${fileName}`;

        const { error: profileError } = await supabase
            .from('user_profile')
            .update({profile_images: imageUrl})
            .eq('profile_id', profile_id)

        if( profileError ) {
            error('업로드 실패!');
            return;
        }

        setUserData((prev) => {
            if( !prev ) return prev

            return {
                ...prev,
                profile:[
                    {
                        ...prev.profile[0],
                        profile_images: imageUrl
                    }
                ]
            }
        })

        success('업로드 성공!');
        setShowProfileDrop(false);

    }

    const handleDeleteBtn = () => {
        setPrevProfileImage( Default_profile );
    }

    const handleCloseBtn = () => {
        setShowProfileDrop( false );
    }

  return (
    <div className={S.wrapper}>
        <div className={S.container}>
            <div className={S.header}>
                <h1>프로필 이미지</h1>
                <button className={S.closeBtn}>
                    <img src={closeBtn} onClick={handleCloseBtn} />
                </button>
            </div>
            <img src={prevProfileImage} className={S.profileImg} />
            <div className={S.buttons}>
                <button type='button' onClick={handleDeleteBtn}>삭제</button>
                <input ref={inputRef} type='file'  style={{display: 'none'}} accept='image/*' onChange={handleFileChange}   />
                <button type='button' onClick={handleFileUpload}>업로드</button>
                <button type='button' onClick={handleFileApply}>적용</button>
            </div>
        </div>
    </div>
  )
}

export default ProfileEdit
