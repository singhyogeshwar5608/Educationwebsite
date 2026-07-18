import { CheckCircle } from "lucide-react";

const highlights = [
  "Government Recognized & Certified Institute",
  "Industry-Relevant Curriculum Updated Regularly",
  "Practical Training with Live Projects",
  "Dedicated Placement Cell with Top Recruiters",
];

export default function InstituteIntroduction() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image - same pattern as homepage WhyChooseUs */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://sfile.chatglm.cn/images-ppt/47b4f18a9587.jpg"
                alt="Future Skills Institute campus building"
                className="w-full h-[400px] object-cover"
              />
            </div>
            {/* Decorative badge - same as homepage */}
            <div className="absolute -bottom-5 -right-5 bg-gold text-navy rounded-xl p-5 shadow-xl">
              <p className="text-3xl font-bold">Est.</p>
              <p className="text-sm font-semibold">Since</p>
              <p className="text-sm font-semibold">2015</p>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
              Who We Are
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">
              Welcome to Future Skills Institute
            </h2>
            <p className="text-text-gray leading-relaxed mb-4">
              Future Skills Institute is a leading computer education and
              professional training center established with a vision to bridge
              the gap between academic learning and industry requirements.
              Founded in 2015, we have been empowering students with
              industry-relevant skills and practical knowledge that help them
              build successful careers in the ever-evolving world of technology
              and business.
            </p>
            <p className="text-text-gray leading-relaxed mb-6">
              Over the past decade, we have trained more than 5,000 students
              across various disciplines including computer applications,
              accounting, digital marketing, web development, and graphic
              design. Our government-certified courses are designed to provide
              hands-on experience through live projects, ensuring that every
              student is job-ready from day one.
            </p>
            <div className="space-y-3 mb-8">
              {highlights.map((item) => (
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
              Get In Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
