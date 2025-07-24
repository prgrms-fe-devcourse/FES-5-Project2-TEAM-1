import { createContext, useContext } from "react";
import type { Tables } from "../../supabase/database.types";

interface BoardDataType {
  boardData: Tables<"board"> | null;
  setBoardData: React.Dispatch<React.SetStateAction<Tables<"board"> | null>>;
}

export const BoardContext = createContext<BoardDataType | null>(null);

export function useBoardContext() {
  const ctx = useContext(BoardContext);
  if (!ctx)
    throw new Error("useBoardContext는 <boardContext> 안에서 사용해야합니다.");
  return ctx;
}
