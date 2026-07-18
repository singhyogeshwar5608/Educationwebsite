"use client";

import { useState } from "react";
import { Search, RotateCcw, Hash } from "lucide-react";

interface ResultSearchProps {
  onSearch: (rollNumber: string) => void;
  onReset: () => void;
  hasResult: boolean;
}

export default function ResultSearch({ onSearch, onReset, hasResult }: ResultSearchProps) {
  const [rollNumber, setRollNumber] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber.trim()) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      return;
    }
    onSearch(rollNumber.trim());
  };

  const handleReset = () => {
    setRollNumber("");
    onReset();
  };

  return (
    <section className="py-12 lg:py-16 bg-white relative">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Card — Premium Glass Card */}
        <div className="relative">
          {/* Gradient border glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-navy via-gold to-navy-light rounded-2xl opacity-20 blur-sm" />

          <div className="relative bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-8 sm:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Hash className="w-8 h-8 text-gold" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-2">
                Search Your Result
              </h2>
              <p className="text-text-gray text-sm sm:text-base">
                Enter your roll number to view examination marks and grade
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="Enter Roll Number (e.g. ZTCA-2024-001)"
                  className={`w-full pl-12 pr-4 py-4 bg-light-blue border-2 border-gray-200 rounded-xl text-navy font-medium text-lg placeholder:text-text-gray/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all ${
                    isShaking ? "animate-shake border-red-400" : ""
                  }`}
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-navy hover:bg-navy-light text-white font-semibold py-4 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 text-lg"
                >
                  <Search className="w-5 h-5" />
                  Search Result
                </button>
                {hasResult && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-gray-100 hover:bg-gray-200 text-navy font-semibold px-6 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </button>
                )}
              </div>
            </form>

            {/* Hint */}
            <div className="mt-6 p-4 bg-light-blue/50 rounded-xl border border-navy/5">
              <p className="text-xs text-text-gray text-center">
                <strong className="text-navy">Sample Roll Numbers:</strong>{" "}
                ZTCA-2024-001 &bull; ZTCA-2024-002 &bull; ZTCA-2024-004 &bull; ZTCA-2024-009
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shake animation keyframes injected via style tag */}
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
