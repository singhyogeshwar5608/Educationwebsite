import { Award, CheckCircle, Download } from "lucide-react";

export default function CertificatePreview() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Certificate Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border-4 border-gold/30 p-8 sm:p-12 relative overflow-hidden">
              {/* Watermark */}
              <div className="absolute top-4 right-4 opacity-10">
                <Award className="w-32 h-32 text-navy" />
              </div>

              {/* Certificate Content */}
              <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Award className="w-6 h-6 text-gold" />
                  <span className="text-navy font-bold text-sm tracking-widest uppercase">
                    Certificate of Completion
                  </span>
                </div>
                <div className="w-24 h-0.5 bg-gold mx-auto mb-6" />

                <p className="text-text-gray text-sm mb-2">This is to certify that</p>
                <p className="text-navy font-bold text-2xl mb-2">Student Name</p>
                <p className="text-text-gray text-sm mb-6">has successfully completed the course</p>
                <p className="text-navy font-bold text-lg mb-6">Course Title</p>

                <div className="w-24 h-0.5 bg-gold mx-auto mb-6" />

                <div className="flex items-center justify-center gap-8 text-xs text-text-gray">
                  <div>
                    <p className="font-semibold text-navy">Director</p>
                    <div className="w-16 h-0.5 bg-navy/30 mt-1" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy">Date</p>
                    <div className="w-16 h-0.5 bg-navy/30 mt-1" />
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative gradient behind */}
            <div className="absolute -inset-4 bg-gradient-to-br from-gold/5 to-navy/5 rounded-2xl -z-10" />
          </div>

          {/* Certificate Info */}
          <div>
            <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
              Certification
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">
              Government Recognized Certificate
            </h2>
            <p className="text-text-gray leading-relaxed mb-6">
              Upon successful completion of the course and all assessments, you will
              receive a government-recognized certificate that is valid across India.
              Our certifications are accepted by top companies and organizations,
              giving you a competitive edge in the job market.
            </p>
            <div className="space-y-4 mb-8">
              {[
                "Government-recognized certification",
                "Valid across India and internationally",
                "Verifiable through our online portal",
                "Includes unique certificate ID",
                "Lifetime validity — no renewal required",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green shrink-0" />
                  <span className="text-text-dark font-medium">{item}</span>
                </div>
              ))}
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-7 py-3 rounded-lg transition-all hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              Get Certified
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
