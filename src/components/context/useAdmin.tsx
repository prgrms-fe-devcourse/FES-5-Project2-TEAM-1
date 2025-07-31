import { useAuth } from "@/auth/AuthProvider";
import { AdminContext } from "@/pages/Study/context/AdminContext";
import supabase from "@/supabase/supabase";
import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";


export const AdminProvider = ({ children }: { children:ReactNode }) => {
  const { profileId } = useAuth();
  const { id } = useParams();

  const [adminId, setAdminId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!profileId|| !id) return;

      const {data} = await supabase.from('board').select('profile_id').eq('board_id', id).single()
      setAdminId(data?.profile_id ?? '');
      setIsLoading(false);
    };

    fetchData();
  }, [profileId, id]);
  const isAdmin = !isLoading && profileId === adminId;

  return (
    <AdminContext.Provider value={{ isAdmin, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
};
