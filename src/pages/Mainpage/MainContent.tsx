import { useState, useEffect, useRef } from "react";
import BannerSection from "./BannerSection";
import NewsSection from "./NewsSection";
import MainStudyCard from "./MainStudyCard";
import S from "./MainContent.module.css";
import { debounce } from "@/utils/debounce";

function MainContent() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debouncedSetSearch = useRef(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 400)
  ).current;

  useEffect(() => {
    debouncedSetSearch(search);
  }, [search]);

  return (
    <section className={S.mainContent}>
      <div className={S.bannerSection}>
        <BannerSection search={search} setSearch={setSearch} />
      </div>

      <div className={S.mainStudyCard}>
        <MainStudyCard search={debouncedSearch} />
      </div>

      <div className={S.newsSection}>
        <NewsSection />
      </div>
    </section>
  );
}

export default MainContent;
