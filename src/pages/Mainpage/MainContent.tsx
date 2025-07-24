
import { useState } from "react"
import BannerSection from "./BannerSection"
import S from "./MainContent.module.css"
import NewsSection from "./NewsSection"
import StudyCardList from "./StudyCardList"


function MainContent() {

  const [search, setSearch] = useState("");

  return (
    <section className={S.mainContent}>
        <BannerSection search={search} setSearch={setSearch} />
        <StudyCardList search={search} />
        <NewsSection />
    </section>
  )
}
export default MainContent