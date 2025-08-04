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
      <BannerSection search={search} setSearch={setSearch} />
      <MainStudyCard search={debouncedSearch} />
      <NewsSection />
    </section>
  );
}

export default MainContent;
