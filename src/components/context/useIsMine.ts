import { useContext } from "react";
import IsMineContext from "./isMine";

export function useIsMine() {
  const context = useContext(IsMineContext);
  if (!context) {
    throw new Error("useIsMine은 isMineProvider안에서 사용해야합니다");
  }
  return context;
}
