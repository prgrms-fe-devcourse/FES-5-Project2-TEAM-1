import { createContext } from "react";

export const AdminContext = createContext<{
  isAdmin: boolean;
  isLoading: boolean;
}>({ isAdmin: false, isLoading: true });
