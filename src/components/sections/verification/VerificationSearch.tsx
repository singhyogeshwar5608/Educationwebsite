"use client";

import { useState } from "react";
import { Search, RotateCcw, ShieldCheck, Loader2 } from "lucide-react";

interface VerificationSearchProps {
  onSearch: (registrationNumber: string) => void;
  onReset: () => void;
  hasResult: boolean;
  isLoading?: boolean;
}

export default function VerificationSearch({ onSearch, onReset, hasResult, isLoading }: VerificationSearchProps) {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!registrationNumber.trim()) {
      setError("Please enter a registration number");
      return;
    }
    onSearch(registrationNumber.trim());
  };

  const handleReset = () => {
    setRegistrationNumber("");
    setError("");
    onReset();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
        <label htmlFor="registration-number" className="block text-sm font-semibold text-navy mb-1.5">
          Registration Number
        </label>
        <div className="relative">
          <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-text-gray pointer-events-none">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <input
            id="registration-number"
            type="text"
            value={registrationNumber}
            onChange={(e) => { setRegistrationNumber(e.target.value); setError(""); }}
            placeholder="e.g. REG2025001"
            className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-white border-2 rounded-xl text-navy font-medium text-base sm:text-lg placeholder:text-gray-400 transition-all outline-none focus:ring-2 focus:ring-offset-0 ${
              error
                ? "border-red-300 focus:border-red-400 focus:ring-red-200"
                : "border-gray-200 focus:border-green focus:ring-green/20"
            }`}
            disabled={isLoading}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 inline-flex items-center justify-center gap-2 bg-green hover:bg-green-light text-white font-semibold py-3 sm:py-3.5 rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-base disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus:outline-none focus:ring-2 focus:ring-green/50 focus:ring-offset-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Verify Now
            </>
          )}
        </button>
        {hasResult && (
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-navy font-semibold px-6 py-3 sm:py-3.5 rounded-xl transition-all text-base focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            Verify Again
          </button>
        )}
      </div>
    </form>
  );
}
