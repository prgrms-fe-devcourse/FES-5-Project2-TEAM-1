import { createContext, useContext } from "react";
import type { Tables } from "../../supabase/database.types";

type boardType = Omit<Tables<"board">, "board_id" | "create_at" | "likes">;

interface BoardDataType {
  boardData: boardType | null;
  setBoardData: React.Dispatch<React.SetStateAction<boardType | null>>;
}

export const BoardContext = createContext<BoardDataType | null>(null);

export function useBoardContext() {
  const ctx = useContext(BoardContext);
  if (!ctx)
    throw new Error("useBoardContext는 <boardContext> 안에서 사용해야합니다.");
  return ctx;
}
