import { useContext } from "react"
import { RouterContext } from "../router"

interface Props{
  to: string
  children:React.ReactNode
}

function NavLink({ to,children }: Props) {
  
  const {setHistoryRoute} = useContext(RouterContext)!

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>)  => {
    e.preventDefault()

    if (e.target instanceof HTMLButtonElement) {
       return
    } else {
      setHistoryRoute(to);
      history.pushState(null, "", to);
    }
   
  }

  return (
    <a href={to} onClick={(e)=>handleLink(e)}>{children}</a>
  )
}

export default NavLink