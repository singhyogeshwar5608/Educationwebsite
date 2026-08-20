import { ShieldX, ArrowLeft } from "lucide-react";

interface NoCertificateFoundProps {
  registrationNumber: string;
  onTryAgain: () => void;
}

export default function NoCertificateFound({ registrationNumber, onTryAgain }: NoCertificateFoundProps) {
  return (
    <section className="py-5 sm:py-8 lg:py-12 bg-light-gray">
      <div className="max-w-lg mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-red-400 via-orange-300 to-red-400 rounded-xl sm:rounded-2xl opacity-15 blur-sm" />
          <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <ShieldX className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-navy mb-1.5 sm:mb-2">Certificate Not Found</h3>
            <p className="text-text-gray text-xs sm:text-sm mb-1.5 sm:mb-2">
              We could not verify any certificate with registration number:
            </p>
            <p className="text-navy font-bold text-base sm:text-lg mb-4 sm:mb-6 bg-light-blue inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg">
              {registrationNumber}
            </p>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-text-gray mb-4 sm:mb-6">
              <p>Possible reasons:</p>
              <ul className="text-left max-w-xs mx-auto space-y-1 sm:space-y-1.5">
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <span className="w-1.5 h-1.5 bg-navy rounded-full mt-1 sm:mt-1.5 shrink-0" />
                  <span>Registration number may be entered incorrectly</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <span className="w-1.5 h-1.5 bg-navy rounded-full mt-1 sm:mt-1.5 shrink-0" />
                  <span>Certificate may not have been issued yet</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1 sm:mt-1.5 shrink-0" />
                  <span>This certificate may not be from Z-TECH CAREER ACADEMY</span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <span className="w-1.5 h-1.5 bg-navy rounded-full mt-1 sm:mt-1.5 shrink-0" />
                  <span>Contact the institute for manual verification</span>
                </li>
              </ul>
            </div>
            <button
              onClick={onTryAgain}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl transition-all hover:shadow-lg text-sm sm:text-base"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
