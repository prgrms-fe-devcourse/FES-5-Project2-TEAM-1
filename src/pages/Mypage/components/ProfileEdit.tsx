

import type { Tables } from 'src/supabase/database.types';
import S from './ProfileEdit.module.css';
import closeBtn from '/icons/edit_close.svg';
import type { User } from '../Mypage';
import { useEffect, useRef, useState } from 'react';
import Default_profile from '/images/애플.png';
import supabase from '../../../supabase/supabase';
import { useToast } from '@/utils/useToast';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { createPortal } from 'react-dom';


interface Props {
    prevProfileImage: string,
    setPrevProfileImage: (value: string) => void;
    setShowProfileDrop: (value: boolean) => void;
    profileData: Tables<'user_profile'>;
    setUserData: React.Dispatch<React.SetStateAction<User | null>>;
    showProfileDrop: boolean
}

function ProfileEdit({ prevProfileImage, setPrevProfileImage, setShowProfileDrop, showProfileDrop, profileData, setUserData}: Props) {

    const { error } = useToast();
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);

    const container = document.getElementById('standard-container');

    const inputRef = useRef<HTMLInputElement | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (showProfileDrop && popupRef.current) {
            gsap.fromTo(
            popupRef.current,
            { opacity: 0, y: -20, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
            );
        } else if (!showProfileDrop && popupRef.current) {
            gsap.to(popupRef.current, {
            opacity: 0,
            y: -10,
            scale: 0.95,
            duration: 0.3,
            ease: 'power2.in',
            });
        }
    }, [showProfileDrop])

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


        if( !profileData ) return;

        const { profile_id } = profileData;

        const default_image = 'https://zugionbtbljfyuybihxk.supabase.co/storage/v1/object/public/profileimages/profile/e564cf92-7719-43db-9803-100bd6cf23f6-profile-1753406546405.jpg'
        let imageUrl: string | null = null;

        if( !file ) {
            imageUrl = default_image;
        } else {
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
            imageUrl = `https://zugionbtbljfyuybihxk.supabase.co/storage/v1/object/public/profileimages/profile/${fileName}`;
        }

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

        toast.info('프로필 이미지가 적용되었습니다.',{
                    onClose() {
                        navigate(`/mypage/${profileData.profile_id}`)
                    }, 
                    autoClose: 1500
            })
        setShowProfileDrop(false);

    }

    const handleDeleteBtn = () => {
        setPrevProfileImage( Default_profile );

        toast.info('삭제 후 적용버튼을 꼭 눌러주세요.',  {onClose() {
                navigate(`/mypage/${profileData.profile_id}`)
            }, autoClose: 1500});
    }

    const handleCloseBtn = () => {
        setShowProfileDrop( false );
    }

    if (!container) {
        return null; 
    }


  return createPortal(
    <div className={S.wrapper}>
        <div ref={popupRef} className={S.container}>
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
    </div>,
    container
  )
}

export default ProfileEdit
