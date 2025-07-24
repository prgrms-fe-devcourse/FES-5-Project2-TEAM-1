import type { Tables } from "@/supabase/database.types"
import { createContext, useContext } from "react"


type Board = Tables<'board'>

export const BoardContext = createContext<{
  selectedBoard: Board | null;
  setSelectedBoard: (data: Board) => void;
}>({selectedBoard:null, setSelectedBoard: ()=>{}})
 

export const useBoard = () => useContext(BoardContext)

