import S from '@/components/Layout/LeftSidebar.module.css';
import E from './UserList.module.css';
import { useAuth } from '@/auth/AuthProvider';
import { useEffect, useState } from 'react';
import supabase from '@/supabase/supabase';
import type { User } from '@/pages/Mypage/Mypage';



function UserList() {

    const { user, isLoading, profileId } = useAuth();
    const [isUser, setIsUser] = useState(false);
    const [openPopupIndex, setOpenPopupIndex] = useState<number | null>(null);
    const [userData, setUserData] = useState<User[] | null>(null);

    useEffect(() => {
        if (!isLoading || !user || !profileId) return;
        setIsUser(true);

    }, [isLoading])

    useEffect(() => {
        const fetchUser = async () => {
            const { data: fetchData, error: fetchError} = await supabase
                .from('user_base')
                .select(` *,
                profile: user_profile(*)`)

            if( fetchData ) {
                setUserData( fetchData );
            }
            if( fetchError ) {
                console.log( fetchError );
            }
        }
        fetchUser();
    }, [])

    const handlePopupToggle = (index: number) => {
        setOpenPopupIndex(prev => (prev === index ? null : index ));
    }

  return (
    <>
     <ul className={S.recentEnterUser}>
            { userData && userData.map((user, i) => (
            <li className={S.enterUser} key={user.id} style={{ position: 'relative'}}>
                <button className={S.enterUser} onClick={() => handlePopupToggle(i)}>
                    <div className={S.profileImage}>
                        <img src={user.profile[0]?.profile_images } alt='' />
                    </div>
                    <p>{user.nickname}</p>
                </button>
        { openPopupIndex === i && (
            <div className={E.popup}>
                <ul>
                    <li><a>마이페이지</a></li>
                    <li><a>피어리뷰</a></li>
                </ul>
            </div> 
            )}
            </li>
        ))}
        </ul>
    </>
  )
}

export default UserList
