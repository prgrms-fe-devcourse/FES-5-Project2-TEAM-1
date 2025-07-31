import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface ProfileImageType {
  profileImage: File | null;
  setProfileImage: Dispatch<SetStateAction<File | null>>;
  imageUrl: string;
  setImageUrl: Dispatch<SetStateAction<string>>;
}
// eslint-disable-next-line react-refresh/only-export-components
export const ProfileImageContext = createContext<ProfileImageType | null>(null);

export function ProfileImageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  return (
    <ProfileImageContext.Provider
      value={{ profileImage, setProfileImage, imageUrl, setImageUrl }}
    >
      {children}
    </ProfileImageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProfileImageContext() {
  const ctx = useContext(ProfileImageContext);
  if (!ctx)
    throw new Error(
      "useProfilImageContext는 <ProfileImageContextProvider> 안에서 사용해야합니다."
    );
  return ctx;
}
