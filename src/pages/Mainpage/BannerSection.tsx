

import S from "./BannerSection.module.css"

interface Props {
  search:string;
  setSearch: (value:string)=>void;
}

function BannerSection({search, setSearch}: Props) {
  
  return (
    <section className={S.container}>
            <div className={S.bannerImage}>
                <img src="images/banner2.png" alt="모여봐요 프둥이숲" />
            </div>
            <div className={S.searchWrapper}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className={S.searchIcon}
                >
                  <path d="M21.53 20.47l-4.77-4.77a7.5 7.5 0 1 0-1.06 1.06l4.77 4.77a.75.75 0 1 0 1.06-1.06ZM10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="관심 스터디를 검색해보세요!" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={S.searchInput}
            />
            </div>
            
    </section>
  )
}
export default BannerSection

