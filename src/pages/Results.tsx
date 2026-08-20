import { useState, useCallback } from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import CTA from "@/components/sections/CTA";
import ResultHero from "@/components/sections/results/ResultHero";
import ResultSearch from "@/components/sections/results/ResultSearch";
import ResultCard from "@/components/sections/results/ResultCard";
import NoResultFound from "@/components/sections/results/NoResultFound";
import VerificationSearch from "@/components/sections/verification/VerificationSearch";
import VerificationCard from "@/components/sections/verification/VerificationCard";
import NoCertificateFound from "@/components/sections/verification/NoCertificateFound";
import AnimateOnScroll from "@/components/shared/AnimateOnScroll";
import { ShieldCheck } from "lucide-react";
import { publicService } from "@/services/public.service";
import type { StudentResult } from "@/data/results";
import type { CertificateData } from "@/data/certificates";

type SearchState = "idle" | "found" | "not_found";
type Tab = "result" | "certificate";

function TabButton({ active, label, icon: Icon, count, onClick }: {
  active: boolean; label: string; icon: React.ComponentType<{ className?: string }>; count?: number; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 text-sm font-semibold rounded-lg transition-all ${
        active
          ? "bg-navy text-white shadow-lg shadow-navy/20"
          : "bg-gray-50 text-gray-500 hover:text-navy hover:bg-gray-100"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {count !== undefined && (
        <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
          active ? "bg-gold text-navy" : "bg-gray-200 text-gray-600"
        }`}>{count}</span>
      )}
    </button>
  );
}

export default function Results() {
  const [tab, setTab] = useState<Tab>("result");

  const [resultState, setResultState] = useState<SearchState>("idle");
  const [result, setResult] = useState<StudentResult | null>(null);
  const [searchedRegNo, setSearchedRegNo] = useState("");
  const [isResultLoading, setIsResultLoading] = useState(false);

  const [certState, setCertState] = useState<SearchState>("idle");
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [searchedRegNoCert, setSearchedRegNoCert] = useState("");
  const [isCertLoading, setIsCertLoading] = useState(false);

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

  const handleCertSearch = useCallback(async (registrationNumber: string) => {
    setIsCertLoading(true);
    setSearchedRegNoCert(registrationNumber);
    try {
      const found = await publicService.certificates.verify(registrationNumber) as CertificateData;
      setCertificate(found);
      setCertState("found");
    } catch {
      setCertificate(null);
      setCertState("not_found");
    } finally {
      setIsCertLoading(false);
    }
  }, []);

  const handleCertReset = useCallback(() => {
    setCertState("idle");
    setCertificate(null);
    setSearchedRegNoCert("");
    setIsCertLoading(false);
  }, []);

  const handleTabChange = useCallback((next: Tab) => {
    setTab(next);
    // Clear all previous search state so no stale data bleeds between tabs.
    handleResultReset();
    handleCertReset();
  }, [handleResultReset, handleCertReset]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ResultHero />

        {/* Tabbed Search Section */}
        <section className="py-6 sm:py-8 bg-white">
          <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8">
            {/* Tab Buttons */}
            <div className="flex gap-2 mb-5">
              <TabButton
                active={tab === "result"}
                label="Search Result"
                icon={({ className }) => <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                onClick={() => handleTabChange("result")}
              />
              <TabButton
                active={tab === "certificate"}
                label="Verify Certificate"
                icon={({ className }) => <ShieldCheck className={className} />}
                onClick={() => handleTabChange("certificate")}
              />
            </div>

            {/* Premium Search Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 sm:p-6 lg:p-8">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm ${
                tab === "result" ? "bg-navy" : "bg-green"
              }`}>
                {tab === "result" ? (
                  <svg className="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ) : (
                  <ShieldCheck className="w-6 h-6 text-white" />
                )}
              </div>

              <h3 className="text-center text-lg sm:text-xl font-bold text-navy mb-1">
                {tab === "result" ? "Search Your Result" : "Verify Certificate"}
              </h3>
              <p className="text-center text-sm text-text-gray mb-5">
                {tab === "result"
                  ? "Enter your registration number to view your marks and grade"
                  : "Enter registration number to verify your certificate"}
              </p>

              {tab === "result" ? (
                <ResultSearch
                  onSearch={handleResultSearch}
                  onReset={handleResultReset}
                  hasResult={resultState === "found"}
                  isLoading={isResultLoading}
                />
              ) : (
                <VerificationSearch
                  onSearch={handleCertSearch}
                  onReset={handleCertReset}
                  hasResult={certState === "found"}
                  isLoading={isCertLoading}
                />
              )}
            </div>
          </div>
        </section>

        {/* Loading State */}
        {tab === "result" && isResultLoading && (
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

        {tab === "certificate" && isCertLoading && (
          <section className="py-8 bg-light-gray">
            <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 border-3 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-navy mb-1">Verifying Certificate</h3>
                <p className="text-sm text-text-gray">Please wait while we process your request...</p>
              </div>
            </div>
          </section>
        )}

        {/* Result Found */}
        {tab === "result" && !isResultLoading && resultState === "found" && result && (
          <AnimateOnScroll>
            <ResultCard result={result} />
          </AnimateOnScroll>
        )}

        {/* Result Not Found */}
        {tab === "result" && !isResultLoading && resultState === "not_found" && (
          <AnimateOnScroll>
            <NoResultFound registrationNumber={searchedRegNo} onTryAgain={handleResultReset} />
          </AnimateOnScroll>
        )}

        {/* Certificate Verified */}
        {tab === "certificate" && !isCertLoading && certState === "found" && certificate && (
          <AnimateOnScroll>
            <VerificationCard certificate={certificate} />
          </AnimateOnScroll>
        )}

        {/* Certificate Not Found */}
        {tab === "certificate" && !isCertLoading && certState === "not_found" && (
          <AnimateOnScroll>
            <NoCertificateFound registrationNumber={searchedRegNoCert} onTryAgain={handleCertReset} />
          </AnimateOnScroll>
        )}

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
