import type { Tables } from "@/supabase/database.types";
import { useState } from "react";
import { BoardContext } from "./BoardContext";

type Board = Tables<'board'>

interface Props{
  children: React.ReactNode
}

function BoardProvider({ children }: Props) {
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  return (

    <BoardContext.Provider value={{ selectedBoard, setSelectedBoard }}>
      {children}
    </BoardContext.Provider>
  )
}


export default  BoardProvider