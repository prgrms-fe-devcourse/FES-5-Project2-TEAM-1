import S from '@/components/Layout/LeftSidebar.module.css';
import E from './UserList.module.css';
import { useAuth } from '@/auth/AuthProvider';
import { useEffect, useState } from 'react';
import supabase from '@/supabase/supabase';
import type { User } from '@/pages/Mypage/Mypage';
import type { StatusCode } from './Layout/RightSidebar';



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
                console.log( fetchData );
                setUserData( fetchData );
            }
            if( fetchError ) {
                console.log( fetchError );
            }
        }
        fetchUser();
    }, [])

    useEffect(() => {
        const channel = supabase
            .channel('status-list')
            .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'user_base',
            },
            (payload) => {
               const updatedUser = payload.new;
                setUserData((prevData) => {
                if (!prevData) return prevData;
                    return prevData.map((user) =>
                        user.id === updatedUser.id
                        ? { ...user, status: updatedUser.status }
                        : user
                    );
                });
            }
            )
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };

    }, []);

    const handlePopupToggle = (index: number) => {
        setOpenPopupIndex(prev => (prev === index ? null : index ));
    }

const statusClassName = (status: StatusCode) => {
     const statusNum = Number(status); 
        switch (statusNum) {
            case 0:
            return S.online;
            case 1:
            return S.offline;
            case 2:
            return S.dnd;
            case 3:
            return S.away;
            default:
            return S.offline; // 기본은 오프라인
        }
};

  return (
    <>
     <ul className={S.recentEnterUser}>
            { userData && userData.map((user, i) => (
            <li className={S.enterUser} key={user.id} style={{ position: 'relative'}}>
                <button className={S.enterUser} onClick={() => handlePopupToggle(i)}>
                    <div className={S.profileImage}>
                        <img src={user.profile[0]?.profile_images } alt='' />
                        <div className={`${S.statusDot} ${statusClassName(user.status)}`}></div>
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
