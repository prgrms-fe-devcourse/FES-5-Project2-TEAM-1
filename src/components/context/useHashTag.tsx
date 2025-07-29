import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

interface BaseTagData {
  value: string;
}

interface HashTagType {
  hashTagData: BaseTagData[] | null;
  sethashTagData: Dispatch<SetStateAction<BaseTagData[] | null>>;
}
// eslint-disable-next-line react-refresh/only-export-components
export const HashTagContext = createContext<HashTagType | null>(null);

export function HashTagProvider({ children }: { children: React.ReactNode }) {
  const [hashTagData, sethashTagData] = useState<BaseTagData[] | null>([]);

  return (
    <HashTagContext.Provider value={{ hashTagData, sethashTagData }}>
      {children}
    </HashTagContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useHashTagContext() {
  const ctx = useContext(HashTagContext);
  if (!ctx)
    throw new Error(
      "useHashTagContext는 <HashTagContextProvider> 안에서 사용해야합니다."
    );
  return ctx;
}
