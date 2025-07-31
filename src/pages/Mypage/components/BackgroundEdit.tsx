import { useRef, useState, type ChangeEvent } from 'react';
import E from '../MypageEdit.module.css';
import type { Tables } from 'src/supabase/database.types';
import supabase from '../../../supabase/supabase';
import type { User } from '../Mypage';
import CloseIcon  from '/icons/edit_close.svg';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface Props {
  prevImage: string;
  setPrevImage: (value: string) => void;
  setShowDropdown: (value: boolean) => void;
  profileData: Tables<'user_profile'>;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
}

function BackgroundEdit({ prevImage, setPrevImage, setShowDropdown, profileData, setUserData }: Props) {

    const [file, setFile] = useState<File | null>(null);
    // const [showAlert, setShowAlert] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const handleFileUpload = ( ) => {
        // const fileInput = document.getElementById('fileInput') as HTMLInputElement; 
        inputRef.current?.click();
    }

    const handleFileChange = ( e:ChangeEvent<HTMLInputElement>) => {
        const coverFiles = e.currentTarget.files;

        if( coverFiles && coverFiles.length > 0 ) {
            const lastFile = coverFiles[ coverFiles.length -1 ];
            setFile( lastFile );
            setPrevImage( URL.createObjectURL( lastFile ) );
        } else {
            setFile( null );
            setPrevImage(prevImage);
        }

        if( inputRef.current ) {
            inputRef.current.value = '';
        }
    }

    const handleFileApply = async () => {
        //누르면 저장되고 서버에 올라가기
        //알람으로 저장됐음을 알려주기
        
        if( !profileData ) return;

        const { profile_id } = profileData;

        const default_image =  'https://zugionbtbljfyuybihxk.supabase.co/storage/v1/object/public/backgroundimages/profile-backgrounds/e564cf92-7719-43db-9803-100bd6cf23f6-1753344498261.jpg'
        let imageUrl: string | null = null;

        if( !file ) {
            imageUrl = default_image;
        } else {
            const fileName = `${profile_id}-${Date.now()}.jpg`;

            // supabase storage 에 업로드
            const { error: uploadError } = await supabase.storage
                .from('backgroundimages')
                .upload(`profile-backgrounds/${fileName}`, file);

            if( uploadError ) {
                console.log( '파일 업로드 실패', uploadError);
                return;
            }

            // 파일 URL 생성
            imageUrl = `https://zugionbtbljfyuybihxk.supabase.co/storage/v1/object/public/backgroundimages/profile-backgrounds/${fileName}`;
        }

        // 업로드된 이미지 URL을 DB에 저장
        const { error: bgImageError } = await supabase
            .from('user_profile')
            .update({background_images: imageUrl,})
            .eq('profile_id', profile_id);

            if( bgImageError ) {
                console.error('DB 업데이트 실패!!', bgImageError );
                return;
            }

            setUserData( (prev) => {
                if( !prev ) return prev;

                return {
                    ...prev,
                    profile: [
                        {
                            ...prev.profile[0],
                            background_images: imageUrl
                        }
                    ]
                } as typeof prev;
            })

            // alert('성공적으로 업로드가 완료되었습니다~!');
            toast.info(
                imageUrl
                ? '배경이미지가 적용되었습니다.'
                : '배경이미지가 삭제되었습니다.', {
                    onClose() {
                        navigate(`/mypage/${profileData.profile_id}`)
                    }, 
                    autoClose: 1500
            })
            setShowDropdown(false);
    
    }


    const handleDeleteFile = () => {
        setPrevImage('/images/default_cover.png');

        toast.info('삭제 후 적용버튼을 꼭 눌러주세요.',  {onClose() {
                navigate(`/mypage/${profileData.profile_id}`)
            }, autoClose: 1500});
    }

    const handleClosePopup = () => {
        setShowDropdown(false);
    }

  return (
    <div className={E.backgroundEditWrapper}>
        <div ref={popupRef} className={E.backgroundEditContainer}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px'}}>
                <h1>배경 이미지</h1>
                <button onClick={handleClosePopup} className={E.bgEditCloseBtn}>
                    <img src={CloseIcon} alt='배경 이미지 수정창 닫기 버튼' />
                </button>
            </div>
            {
                file 
                ? (<img src={URL.createObjectURL(file)} />)
                    : (<img src={prevImage}/>)
            }
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3rem', flex: '11'}}>
                <button onClick={handleDeleteFile} className={E.bgEditDeleteBtn}>삭제</button>
                <input ref={inputRef} type='file' id='fileInput' style={{display: 'none'}} accept='image/*' onChange={handleFileChange} />
                <button onClick={handleFileUpload}>업로드</button>
                <button onClick={handleFileApply}>적용</button>
            </div>
        </div>
    </div>
  )
}

export default BackgroundEdit