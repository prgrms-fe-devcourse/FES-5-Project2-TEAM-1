import supabase from "@/supabase/supabase";
import { createContext, useContext, useEffect, useState } from "react";
interface User {
  id: string;
  email: string;
  lastSignAt: string;
}
interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  logout: () => void;
  isLoading: boolean;
  profileId: string | null;
}
const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileId, setProfileId] = useState<string | null>(null);
  useEffect(() => {
    const getSessionUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          lastSignAt: session.user.last_sign_in_at!,
        });
      }
      setIsLoading(false);
    };
    getSessionUser();
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            lastSignAt: session.user.last_sign_in_at!,
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
        setIsLoading(false);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    const getProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("user_profile")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (error) {
        console.error("유저 프로필 조회 실패.");
      }
      if (data) {
        setProfileId(data.profile_id);
      }
    };
    getProfile();
  }, [user]);
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileId(null);
  };
  return (
    <AuthContext value={{ user, isAuth: !!user, logout, isLoading, profileId }}>
      {children}
    </AuthContext>
  );
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("<AuthProvider> 안에서만 사용할 수 있습니다.");
  return ctx;
}
