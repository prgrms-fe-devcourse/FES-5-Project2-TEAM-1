import { useEffect, useRef, useState, useLayoutEffect } from "react";
import S from "./NewsSection.module.css";
import supabase from '../../supabase/supabase';
import type { Tables } from "src/supabase/database.types";
import gsap from 'gsap';

type NewsCard = Tables<'news_cards'>;

const ITEM_PER_PAGE = 2;
const VISIBLE_COUNT = 3;

function NewsSection() {
  const [cards, setCards] = useState<NewsCard[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const cardListRef = useRef<HTMLDivElement>(null);

  const fetchCards = async () => {
    const { data, error } = await supabase
      .from('news_cards')
      .select("*");

    if (data) {
      const shuffled = [...data].sort(() => Math.random() - 0.5);
      setCards(shuffled);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    if (cards.length < VISIBLE_COUNT) return;

    timerRef.current = window.setInterval(() => {
      setStartIndex((prev) => (prev + ITEM_PER_PAGE) % cards.length);
    }, 3000);

    return () => clearInterval(timerRef.current!);
  }, [cards.length]);

useLayoutEffect(() => {
  if (!cardListRef.current) return;

  const targets = cardListRef.current.querySelectorAll(".card");
  if (!targets.length) return;

  const ctx = gsap.context(() => {
    gsap.fromTo(
      targets,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  }, cardListRef.current);

  return () => ctx.revert();
}, [startIndex]);

  const handlePrev = () => {
    setStartIndex((prev) => (prev - ITEM_PER_PAGE + cards.length) % cards.length);
  };

  const handleNext = () => {
    setStartIndex((prev) => (prev + ITEM_PER_PAGE) % cards.length);
  };

  if (cards.length < VISIBLE_COUNT) return null;

  const visibleCards = [];
  for (let i = 0; i < VISIBLE_COUNT; i++) {
    const index = (startIndex + i) % cards.length;
    visibleCards.push(cards[index]);
  }

  return (
    <section className={S.section}>
      <div className={S.title}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
        </svg>
        <h2>새 소식</h2>
      </div>
      <hr />
      <div className={S.cardListWrapper}>

        <button className={S.arrowLeft} onClick={handlePrev}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className={S.cardList} ref={cardListRef}>
          {visibleCards.map((item) => (
            <div key={item.id} className={`${S.card} card`}>
              <div className={S.cardContent}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <img src={item.image} alt={item.title} />
                </a>
                <div className={S.content}></div>
                <p className={S.p}>
                  {item.title.split('\n').map((line, idx) => (
                    <span key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button className={S.arrowRight} onClick={handleNext}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32px" height="32px" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </section>
  );
}

export default NewsSection;
