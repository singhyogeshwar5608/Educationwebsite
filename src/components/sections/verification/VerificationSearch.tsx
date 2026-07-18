"use client";

import { useState } from "react";
import { Search, RotateCcw, ShieldCheck } from "lucide-react";

interface VerificationSearchProps {
  onSearch: (certNo: string) => void;
  onReset: () => void;
  hasResult: boolean;
}

export default function VerificationSearch({ onSearch, onReset, hasResult }: VerificationSearchProps) {
  const [certNo, setCertNo] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certNo.trim()) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }
    onSearch(certNo.trim());
  };

  const handleReset = () => {
    setCertNo("");
    onReset();
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-white relative">
      <div className="max-w-2xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Search Card — Premium Glass Card */}
        <div className="relative">
          {/* Gradient border glow — green accent for verification */}
          <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-green via-gold to-green-light rounded-xl sm:rounded-2xl opacity-20 blur-sm" />

          <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-8 lg:p-10">
            {/* Header */}
            <div className="text-center mb-5 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-navy mb-1.5 sm:mb-2">
                Verify Certificate
              </h2>
              <p className="text-text-gray text-xs sm:text-sm lg:text-base">
                Enter certificate number to verify its authenticity
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-text-gray">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                  type="text"
                  value={certNo}
                  onChange={(e) => setCertNo(e.target.value)}
                  placeholder="Enter Certificate No (e.g. ZTCA/ADCA/2024/001)"
                  className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-light-blue border-2 border-gray-200 rounded-lg sm:rounded-xl text-navy font-medium text-base sm:text-lg placeholder:text-text-gray/60 focus:outline-none focus:border-green focus:ring-2 focus:ring-green/20 transition-all ${
                    isShaking ? "animate-shake border-red-400" : ""
                  }`}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-green hover:bg-green-light text-white font-semibold py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base sm:text-lg"
                >
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                  Verify Now
                </button>
                {hasResult && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-gray-100 hover:bg-gray-200 text-navy font-semibold px-5 sm:px-6 py-3 sm:py-4 rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2 text-base"
                  >
                    <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                    Reset
                  </button>
                )}
              </div>
            </form>

            {/* Hint */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green/5 rounded-lg sm:rounded-xl border border-green/10">
              <p className="text-[10px] sm:text-xs text-text-gray text-center leading-relaxed">
                <strong className="text-navy">Sample Certificate Numbers:</strong>{" "}
                ZTCA/ADCA/2024/001 &bull; ZTCA/DM/2024/004 &bull; ZTCA/TALLY/2024/009
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </section>
  );
}
