import gsap from "gsap";
import { useRef } from "react"
import S from './MoveToTop.module.css'




function MypageMoveToTop() {
  const topButtonRef = useRef<HTMLButtonElement>(null);

  const handleMoveToTop = () => {
    window.scrollTo({top:0, left:0, behavior:'smooth'})
  }

  const handleEnterUpButton = () => {
    console.log('엔터')
    gsap.to(topButtonRef.current,{
      rotate: 360,
      duration: 1,
      ease:'power2.out',
      onComplete: () => {
        gsap.set(topButtonRef.current, {rotate:0})
      }
    })
  }

  return (
    <div>
      <button 
      className={S.upButton}
      ref={topButtonRef} 
      type="button" 
      onClick={handleMoveToTop} 
      onMouseEnter={handleEnterUpButton}>
        <img src="src/assets/topButton.png" alt="move to top" />
      </button>
    </div>
  )
}
export default MypageMoveToTop