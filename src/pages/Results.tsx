import { useState, useCallback } from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import CTA from "@/components/sections/CTA";
import ResultHero from "@/components/sections/results/ResultHero";
import ResultSearch from "@/components/sections/results/ResultSearch";
import ResultCard from "@/components/sections/results/ResultCard";
import NoResultFound from "@/components/sections/results/NoResultFound";
import AnimateOnScroll from "@/components/shared/AnimateOnScroll";
import { publicService } from "@/services/public.service";
import type { StudentResult } from "@/data/results";

type SearchState = "idle" | "found" | "not_found";

export default function Results() {
  const [resultState, setResultState] = useState<SearchState>("idle");
  const [result, setResult] = useState<StudentResult | null>(null);
  const [searchedRegNo, setSearchedRegNo] = useState("");
  const [isResultLoading, setIsResultLoading] = useState(false);

  const handleResultSearch = useCallback(async (registrationNumber: string) => {
    setIsResultLoading(true);
    setSearchedRegNo(registrationNumber);
    try {
      const found = await publicService.results.search(registrationNumber) as StudentResult;
      setResult(found);
      setResultState("found");
    } catch {
      setResult(null);
      setResultState("not_found");
    } finally {
      setIsResultLoading(false);
    }
  }, []);

  const handleResultReset = useCallback(() => {
    setResultState("idle");
    setResult(null);
    setSearchedRegNo("");
    setIsResultLoading(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ResultHero />

        {/* Result Search Section */}
        <section className="py-6 sm:py-8 bg-white">
          <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8">
            {/* Premium Search Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6 lg:p-8">
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm bg-navy">
                <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>

              <h3 className="text-center text-lg sm:text-xl font-bold text-navy mb-1">
                Search Your Result
              </h3>
              <p className="text-center text-sm text-text-gray mb-5">
                Enter your registration number to view your result details
              </p>

              <ResultSearch
                onSearch={handleResultSearch}
                onReset={handleResultReset}
                hasResult={resultState === "found"}
                isLoading={isResultLoading}
              />
            </div>
          </div>
        </section>

        {/* Loading State */}
        {isResultLoading && (
          <section className="py-8 bg-light-gray">
            <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 border-3 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-navy mb-1">Searching Result</h3>
                <p className="text-sm text-text-gray">Please wait while we process your request...</p>
              </div>
            </div>
          </section>
        )}

        {/* Result Found */}
        {!isResultLoading && resultState === "found" && result && (
          <AnimateOnScroll>
            <ResultCard result={result} />
          </AnimateOnScroll>
        )}

        {/* Result Not Found */}
        {!isResultLoading && resultState === "not_found" && (
          <AnimateOnScroll>
            <NoResultFound registrationNumber={searchedRegNo} onTryAgain={handleResultReset} />
          </AnimateOnScroll>
        )}

        <CTA />
      </main>
      <Footer />
    </div>
  );
}