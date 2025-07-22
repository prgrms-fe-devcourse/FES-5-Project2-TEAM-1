

import S from "./BannerSection.module.css"

function BannerSection() {
  return (
    <section className={S.container}>
            <div className={S.bannerImage}>
                <img src="images/banner.png" alt="모여봐요 프둥이숲" />
            </div>
            
            <input type="text" placeholder="관심 스터디를 검색해보세요!" />
    </section>
  )
}
export default BannerSection