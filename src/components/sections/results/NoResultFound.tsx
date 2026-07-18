import { SearchX, ArrowLeft } from "lucide-react";

interface NoResultFoundProps {
  rollNumber: string;
  onTryAgain: () => void;
}

export default function NoResultFound({ rollNumber, onTryAgain }: NoResultFoundProps) {
  return (
    <section className="py-8 lg:py-12 bg-light-gray">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-400 via-orange-300 to-red-400 rounded-2xl opacity-15 blur-sm" />
          <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <SearchX className="w-10 h-10 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold text-navy mb-2">No Result Found</h3>
            <p className="text-text-gray text-sm mb-2">
              We could not find any result for roll number:
            </p>
            <p className="text-navy font-bold text-lg mb-6 bg-light-blue inline-block px-4 py-1.5 rounded-lg">
              {rollNumber}
            </p>
            <div className="space-y-3 text-sm text-text-gray mb-6">
              <p>Please check the following:</p>
              <ul className="text-left max-w-xs mx-auto space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-navy rounded-full mt-1.5 shrink-0" />
                  Ensure the roll number is entered correctly
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-navy rounded-full mt-1.5 shrink-0" />
                  Results may not be declared yet for this batch
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-navy rounded-full mt-1.5 shrink-0" />
                  Contact the institute for manual verification
                </li>
              </ul>
            </div>
            <button
              onClick={onTryAgain}
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
