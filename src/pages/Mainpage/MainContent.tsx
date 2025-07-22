
import BannerSection from "./BannerSection"
import S from "./MainContent.module.css"
import NewsSection from "./NewsSection"
import StudyCardList from "./StudyCardList"

function MainContent() {
  return (
    <section className={S.mainContent}>
        <BannerSection />
        <StudyCardList />
        <NewsSection />
    </section>
  )
}
export default MainContent