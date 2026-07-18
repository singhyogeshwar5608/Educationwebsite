"use client";

import { useState } from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import CTA from "@/components/sections/CTA";
import ResultHero from "@/components/sections/results/ResultHero";
import ResultSearch from "@/components/sections/results/ResultSearch";
import ResultCard from "@/components/sections/results/ResultCard";
import NoResultFound from "@/components/sections/results/NoResultFound";
import AnimateOnScroll from "@/components/shared/AnimateOnScroll";
import { findResultByRoll, type StudentResult } from "@/data/results";

type SearchState = "idle" | "found" | "not_found";

export default function ResultsPage() {
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [result, setResult] = useState<StudentResult | null>(null);
  const [searchedRoll, setSearchedRoll] = useState("");

  const handleSearch = (rollNumber: string) => {
    const found = findResultByRoll(rollNumber);
    setSearchedRoll(rollNumber);
    if (found) {
      setResult(found);
      setSearchState("found");
    } else {
      setResult(null);
      setSearchState("not_found");
    }
  };

  const handleReset = () => {
    setSearchState("idle");
    setResult(null);
    setSearchedRoll("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ResultHero />

        <AnimateOnScroll>
          <ResultSearch
            onSearch={handleSearch}
            onReset={handleReset}
            hasResult={searchState === "found"}
          />
        </AnimateOnScroll>

        {searchState === "found" && result && (
          <AnimateOnScroll>
            <ResultCard result={result} />
          </AnimateOnScroll>
        )}

        {searchState === "not_found" && (
          <AnimateOnScroll>
            <NoResultFound rollNumber={searchedRoll} onTryAgain={handleReset} />
          </AnimateOnScroll>
        )}

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
