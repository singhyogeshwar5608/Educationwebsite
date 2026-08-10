import { Search, ShieldCheck } from "lucide-react";

export default function Verification() {
  return (
    <section id="results" className="bg-light-gray py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Result Verification */}
          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-navy/10 rounded-xl flex items-center justify-center shrink-0">
                <Search className="w-7 h-7 text-navy" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-navy mb-2">Verify Your Result</h3>
                <p className="text-text-gray mb-6">
                  Enter your Roll Number to view your result online.
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter Roll Number"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                  />
                  <button className="bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap">
                    View Result
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Verification */}
          <div id="certificate" className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-green/10 rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-7 h-7 text-green" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-navy mb-2">Verify Certificate</h3>
                <p className="text-text-gray mb-6">
                  Enter your Certificate Number to verify its authenticity.
                </p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter Certificate Number"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green/20 focus:border-green"
                  />
                  <button className="bg-green hover:bg-green-light text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap">
                    Verify Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
