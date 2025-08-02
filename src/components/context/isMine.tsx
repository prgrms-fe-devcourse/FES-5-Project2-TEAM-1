import { useAuth } from "@/auth/AuthProvider";
import { createContext, useEffect, useState, type ReactNode } from "react";

interface IsMineContextType {
  isMine: boolean;
}

const IsMineContext = createContext<IsMineContextType | undefined>(undefined);

export function IsMineProvider({
  children,
  writerProfileId,
}: {
  children: ReactNode;
  writerProfileId: string | null | undefined
}) {
  const { profileId} = useAuth();
  const [isMine, setIsMine] = useState(false);

  useEffect(() => {
    if (profileId) {
      setIsMine(profileId === writerProfileId);
    }
  }, [profileId, writerProfileId]);

  return (
    <IsMineContext.Provider value={{ isMine }}>
      {children}
    </IsMineContext.Provider>
  );
}

export default IsMineContext;
