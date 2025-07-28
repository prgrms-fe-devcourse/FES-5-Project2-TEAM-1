import gsap from "gsap";
import { useRef } from "react"
import S from './MoveToTop.module.css'




function MypageMoveToTop() {
  const topButtonRef = useRef<HTMLButtonElement>(null);

  const handleMoveToTop = () => {
    window.scrollTo({top:0, left:0, behavior:'smooth'})
  }

  const handleEnterUpButton = () => {
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
    <>
      <h2 hidden>top 버튼</h2>
      <section>
        <button 
        className={S.upButton}
        ref={topButtonRef} 
        type="button" 
        onClick={handleMoveToTop} 
        onMouseEnter={handleEnterUpButton}>
          <img src="/src/assets/topButton.png" alt="move to top" title="최상단 이동" />
        </button>
      </section>
    </>
  )
}
export default MypageMoveToTop