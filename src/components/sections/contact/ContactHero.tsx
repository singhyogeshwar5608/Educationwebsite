import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ChevronRight, Home, MessageCircle } from "lucide-react";

function GoldenDotsGrid() {
  return (
    <div className="absolute -left-6 top-1/2 -translate-y-1/2 grid grid-cols-3 gap-1.5 z-10 hidden sm:grid">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
      ))}
    </div>
  );
}

function CurvedNavyBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 hidden lg:block overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 1440 540" preserveAspectRatio="none" fill="none">
        <defs>
          <linearGradient id="contactNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1A30" />
            <stop offset="50%" stopColor="#0D1C38" />
            <stop offset="100%" stopColor="#061224" />
          </linearGradient>
        </defs>

        <path
          d="M 960 -20 C 840 100, 800 270, 1120 560 L 1440 560 L 1440 -20 Z"
          fill="url(#contactNavyGrad)"
        />
        <path
          d="M 950 -20 C 830 100, 790 270, 1110 560"
          stroke="#F5A623"
          strokeWidth="3.5"
          fill="none"
        />
        <path
          d="M 958 -20 C 838 100, 798 270, 1118 560"
          stroke="#F5A623"
          strokeWidth="1.5"
          fill="none"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}

const contactInfo = [
  { icon: Phone, label: "Call Us", value: "92150-52018" },
  { icon: Mail, label: "Email Us", value: "ztca2012@gmail.com" },
  { icon: MapPin, label: "Visit Us", value: "Kaithal, Haryana" },
];

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-[#F4F7FB] pt-24 sm:pt-28 lg:pt-24">
      <CurvedNavyBackground />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6 lg:pb-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <div className="inline-block mb-3.5">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#0D1C38]" />
                <span className="font-bold text-xs sm:text-sm tracking-[0.16em] text-[#0D1C38] uppercase">
                  GET IN TOUCH
                </span>
              </div>
              <div className="h-[2px] w-full bg-[#F5A623] mt-1" />
            </div>

            <div className="relative mb-4">
              <GoldenDotsGrid />
              <h1 className="text-3xl sm:text-4xl lg:text-[3.2rem] font-[900] tracking-tight uppercase leading-[1.08]">
                <span className="text-[#0D1C38] block mb-1">CONTACT</span>
                <span className="text-[#F5A623] inline-block">Z-TECH ACADEMY</span>
              </h1>
            </div>

            <p className="text-sm sm:text-base text-[#4A5568] leading-relaxed mb-6 sm:mb-8 max-w-lg font-normal">
              Have questions? We are here to help. Reach out to us — our team will
              get back to you as soon as possible.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0D1C38] flex items-center justify-center shrink-0">
                    <info.icon className="w-4 h-4 text-[#F5A623]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-[#0D1C38] uppercase tracking-wide">{info.label}</p>
                    <p className="text-xs font-semibold text-[#4A5568]">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[480px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white">
              <div
                className="w-full max-h-[400px] flex flex-col items-center justify-center text-center px-8 py-14"
                style={{ background: "linear-gradient(135deg, #0D1C38 0%, #0A2647 100%)" }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl mb-6"
                  style={{
                    background: "linear-gradient(135deg, #FFC107 0%, #FFD54F 100%)",
                    boxShadow: "0 20px 60px rgba(255, 193, 7, 0.3)",
                  }}
                >
                  <MessageCircle className="w-10 h-10 text-navy" />
                </div>
                <h3 className="text-white font-bold text-2xl mb-2">Let's Talk</h3>
                <p className="text-blue-200 text-sm mb-6 max-w-[280px]">
                  We would love to hear from you. Send us a message and we will respond shortly.
                </p>
                <div className="flex items-center gap-2 bg-[#F5A623]/15 border border-[#F5A623]/40 text-[#F5A623] text-sm font-semibold px-5 py-2.5 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#F5A623] animate-pulse" />
                  Typically replies within a day
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
