
import { useState } from "react"
import BannerSection from "./BannerSection"
import NewsSection from "./NewsSection"
import MainStudyCard from "./MainStudyCard"
import S from "./MainContent.module.css"



function MainContent() {

  const [search, setSearch] = useState("");

  return (
    <section className={S.mainContent}>
        <BannerSection search={search} setSearch={setSearch} />
        <MainStudyCard search={search} />
        <NewsSection />
    </section>
  )
}
export default MainContent