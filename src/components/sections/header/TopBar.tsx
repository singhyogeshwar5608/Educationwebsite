import { motion } from "framer-motion";

interface TopBarProps {
  scrolled: boolean;
}

const announcements = [
  "Admissions Open 2025-26 — Enroll Now for ADCA, DCA, Tally Prime & more!",
  "100% Job Assistance — Government Certified Institute",
  "Limited Seats Available — Batch starting soon, Register Today!",
];

export default function TopBar({ scrolled }: TopBarProps) {
  return (
    <motion.div
      className="relative bg-navy-dark border-b border-white/[0.06] overflow-hidden block"
      animate={{ opacity: scrolled ? 1 : 0.95 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      style={{ height: "36px" }}
    >
      <div className="flex h-full items-center animate-marquee" style={{ width: "max-content" }}>
        {[...announcements, ...announcements].map((text, i) => (
          <div key={i} className="flex items-center gap-4 px-8 shrink-0">
            <span className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse shrink-0" />
            <span className="text-white/70 text-xs font-medium whitespace-nowrap">{text}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </motion.div>
  );
}
