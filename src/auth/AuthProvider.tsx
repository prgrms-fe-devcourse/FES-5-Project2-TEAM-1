import supabase from "@/supabase/supabase";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  profileId: string;
}

interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSessionUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data, error } = await supabase
          .from("user_profile")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (error) console.error("유저 프로필 조회 실패:", error);

        setUser({
          id: session.user.id,
          email: session.user.email!,
          profileId: data.profile_id,
        });
      }

      setIsLoading(false);
    };

    getSessionUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { data, error } = await supabase
            .from("user_profile")
            .select("*")
            .eq("user_id", session.user.id)
            .limit(1)
            .single();

          if (error) {
            console.error("유저 프로필 조회 실패.");
          }

          setUser({
            id: session.user.id,
            email: session.user.email!,
            profileId: data.profile_id,
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext value={{ user, isAuth: !!user, logout, isLoading }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("<AuthProvider> 안에서만 사용할 수 있습니다.");
  return ctx;
}