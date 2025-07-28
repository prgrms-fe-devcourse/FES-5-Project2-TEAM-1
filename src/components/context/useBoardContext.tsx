import { createContext, useContext, useState } from "react";

type boardType = {
  title: string;
  contents: string;
};

interface BoardDataType {
  postData: boardType | null;
  setPostData: React.Dispatch<React.SetStateAction<boardType>>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const BoardContext = createContext<BoardDataType | null>(null);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [postData, setPostData] = useState({ title: "", contents: "" });

  return (
    <BoardContext.Provider value={{ postData, setPostData }}>
      {children}
    </BoardContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBoardContext() {
  const ctx = useContext(BoardContext);
  if (!ctx)
    throw new Error("useBoardContext는 <boardContext> 안에서 사용해야합니다.");
  return ctx;
}
