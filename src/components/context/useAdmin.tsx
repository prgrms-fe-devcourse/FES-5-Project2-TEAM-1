import { useAuth } from "@/auth/AuthProvider";
import { AdminContext } from "@/pages/Study/context/AdminContext";
import supabase from "@/supabase/supabase";
import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";

// AdminContext.tsx 내부




export const AdminProvider = ({ children }: { children:ReactNode }) => {
  const { user: currentUser } = useAuth();
  const { id } = useParams();

  const [userProfile, setUserProfile] = useState('');
  const [adminId, setAdminId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser || !id) return;

      const [{ data: userData }, { data: adminData }] = await Promise.all([
        supabase.from('user_profile').select('profile_id').eq('user_id', currentUser.id).single(),
        supabase.from('board').select('profile_id').eq('board_id', id).single(),
      ]);

      setUserProfile(userData?.profile_id ?? '');
      setAdminId(adminData?.profile_id ?? '');
      setIsLoading(false);
    };

    fetchData();
  }, [currentUser, id]);

  const isAdmin = !isLoading && userProfile === adminId;

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};
