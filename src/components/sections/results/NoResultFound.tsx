import { SearchX, ArrowLeft, AlertTriangle } from "lucide-react";

interface NoResultFoundProps {
  registrationNumber: string;
  onTryAgain: () => void;
}

export default function NoResultFound({ registrationNumber, onTryAgain }: NoResultFoundProps) {
  return (
    <section className="py-6 sm:py-10 lg:py-14 bg-light-gray">
      <div className="max-w-lg mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
            <SearchX className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-navy mb-2">No Result Found</h3>
          <p className="text-text-gray text-sm sm:text-base mb-2">
            We could not find any result for registration number:
          </p>
          <p className="text-navy font-bold text-base sm:text-lg mb-5 sm:mb-6 bg-light-blue inline-block px-4 py-1.5 rounded-lg border border-navy/5">
            {registrationNumber}
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 sm:mb-6 text-left">
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-amber-800">Possible reasons:</p>
            </div>
            <ul className="space-y-2 ml-6">
              {[
                "Ensure the registration number is entered correctly",
                "Results may not be declared yet for this batch",
                "Contact the institute for manual verification",
              ].map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-1.5 shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onTryAgain}
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            Try Again
          </button>
        </div>
      </div>
    </section>
  );
}
