import { useEffect, useRef, useState } from 'react';
import Card from '@/components/Layout/Card';
import S from './studychannel.module.css'
import supabase from '@/supabase/supabase';
import type { Tables } from 'src/supabase/database.types';
import { debounce } from '@/utils/debounce';


type Card = Tables<'board'>

function StudyChannel() {

  const cardPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1)
  const [cardData, setCardData] = useState<Card[]>([])
  const filterTab = ["최신순", "좋아요순", "모집마감순"]
  const filterRef = useRef<(HTMLButtonElement|null)[]>([])
  
  useEffect(() => {
    const cardData = async () => {
      const { data, error } = await supabase.from("board").select("*");
      if (error) {
        console.log(error.message)
      } else {
        setCardData(
          [...data].sort(
            (a, b) =>
              new Date (b.create_at).getTime() -
              new Date (a.create_at).getTime()
          )
        );
      }
    };
    cardData()
  }, []);
  
  useEffect(() => {
    setCardData(cardData)
  },[cardData])

  function handleFilter(e:React.MouseEvent) {
    if (filterRef.current == null) return
    if (e.currentTarget === filterRef.current[0]) {
     const sorted = [...cardData].sort(
       (a, b) =>
         parseInt(b.board_id.replace(/\D/g, "")) -
         parseInt(a.board_id.replace(/\D/g, ""))
      )
      setCardData(sorted)
    } else if (e.currentTarget === filterRef.current[1]) {
      const sorted = [...cardData].sort((a, b) => b.likes - a.likes)
      setCardData(sorted)
    } else if (e.currentTarget === filterRef.current[2]) {
      const sorted = [...cardData].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
      setCardData(sorted)
    }
  }

  const debouncedSearch = debounce((value: string) => {
    const lowerValue = value.toLowerCase()
    const filtered = cardData.filter(
      (card) =>
        card.title.toLowerCase().includes(lowerValue) ||
        card.contents.toLowerCase().includes(lowerValue) ||
        card.address.toLowerCase().includes(lowerValue)
    );
    setCardData(filtered)
    setCurrentPage(1)
  }, 400)
  
  const startIdx = (currentPage - 1) * cardPerPage
  const endIdx = startIdx + cardPerPage
  const paginatedCards = cardData.slice(startIdx, endIdx);

  const totalPages = Math.ceil(cardData.length / cardPerPage);
  const maxVisible = 5;
  const startPage = Math.max(1, currentPage - 2)
  const endPage = Math.min(totalPages, startPage + maxVisible - 1)
  const adjustedStartPage = Math.max(1, endPage - maxVisible + 1);
  const visiblePage = Array.from({ length: endPage - adjustedStartPage + 1 }, (_, i) => adjustedStartPage + i)
  
  
  
  return (
    <main className={S.container}>
      <div className={S.channelHeader}>
        <div className={S.filterTab}>
          {
            filterTab.map((tab, i) => (
            <button
              type="button"
              className={S.filterBtn}
              key={i}
              ref={(el) => {
                if (el) filterRef.current[i] = el;
              }}
              onClick={(e) => handleFilter(e)}
            >
              {tab}
            </button>
          ))}
        </div>
        <form className={S.searchBox}>
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className={S.studySearch}
            onChange={(e) => {
              debouncedSearch(e.target.value);
            }}
          />
          <button type="submit" className={S.searchBtn}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_276_3490)">
                <path
                  d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                  fill="#555555"
                  fillOpacity="0.7"
                />
              </g>
              <defs>
                <clipPath id="clip0_276_3490">
                  <rect width="24" height="24" fill="transparent" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </form>
        <button type="button" className={S.postBtn}>
          글쓰기
        </button>
      </div>
      <section>
        <div className={S.cardGrid}>
          {...paginatedCards &&
            [...paginatedCards].map((card: Card) => (
              <Card {...card} key={card.board_id} />
            ))}
        </div>
      </section>
      <nav>
        <ul className={S.pagenation}>
          <li>
            <button
              className={S.pagenationNumber}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
          </li>

          {
            visiblePage.map((pageNum) => {
              return(
              <li key={pageNum}>
                <button
                  onClick={() => setCurrentPage(pageNum)}
                  className = { currentPage === pageNum ? S.active : S.pagenationNumber}
                >
                  { pageNum }
                </button>
              </li>
            )})}
          <li>
            <button
              onClick={()=> setCurrentPage((p)=>Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={S.pagenationNumber}>&gt;</button>
          </li>
        </ul>
      </nav>
    </main>
  );
}
export default StudyChannel