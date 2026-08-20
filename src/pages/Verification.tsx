import { useState } from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import CTA from "@/components/sections/CTA";
import VerificationHero from "@/components/sections/verification/VerificationHero";
import VerificationSearch from "@/components/sections/verification/VerificationSearch";
import VerificationCard from "@/components/sections/verification/VerificationCard";
import NoCertificateFound from "@/components/sections/verification/NoCertificateFound";
import AnimateOnScroll from "@/components/shared/AnimateOnScroll";
import { findCertificateByNo, type CertificateData } from "@/data/certificates";

type SearchState = "idle" | "found" | "not_found";

export default function Verification() {
  const [searchState, setSearchState] = useState<SearchState>("idle");
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [searchedRegNo, setSearchedRegNo] = useState("");

  const handleSearch = (certNo: string) => {
    const found = findCertificateByNo(certNo);
    setSearchedRegNo(certNo);
    if (found) {
      setCertificate(found);
      setSearchState("found");
    } else {
      setCertificate(null);
      setSearchState("not_found");
    }
  };

  const handleReset = () => {
    setSearchState("idle");
    setCertificate(null);
    setSearchedRegNo("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <VerificationHero />

        <AnimateOnScroll>
          <VerificationSearch
            onSearch={handleSearch}
            onReset={handleReset}
            hasResult={searchState === "found"}
          />
        </AnimateOnScroll>

        {searchState === "found" && certificate && (
          <AnimateOnScroll>
            <VerificationCard certificate={certificate} />
          </AnimateOnScroll>
        )}

        {searchState === "not_found" && (
          <AnimateOnScroll>
            <NoCertificateFound registrationNumber={searchedRegNo} onTryAgain={handleReset} />
          </AnimateOnScroll>
        )}

        <CTA />
      </main>
      <Footer />
    </div>
  );
}
