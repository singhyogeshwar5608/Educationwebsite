import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItemProps {
  label: string;
  href: string;
  dropdown?: DropdownItem[];
}

export default function NavItem({ label, href, dropdown }: NavItemProps) {
  const [hovered, setHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const enter = () => {
    setHovered(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (dropdown) setShowDropdown(true);
  };
  const leave = () => {
    setHovered(false);
    if (dropdown) timeoutRef.current = setTimeout(() => setShowDropdown(false), 200);
  };

  const linkClass = "relative py-2 text-[15px] font-semibold transition-colors duration-300";
  const textColors = "text-navy-dark hover:text-gold";

  if (!dropdown) {
    return (
      <a
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`${linkClass} ${textColors}`}
      >
        {label}
        <motion.span
          className="absolute bottom-0 left-0 h-[2px] bg-gold rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: hovered ? "100%" : "0%" }}
          style={{ left: "50%", translateX: "-50%" }}
        />
      </a>
    );
  }

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <a
        href={href}
        className={`${linkClass} ${textColors} inline-flex items-center`}
      >
        {label}
        <ChevronDown
          className="w-3.5 h-3.5 ml-1 transition-transform duration-300"
          style={{ transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)" }}
        />
        <motion.span
          className="absolute bottom-0 left-0 h-[2px] bg-gold rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: hovered ? "100%" : "0%" }}
          style={{ left: "50%", translateX: "-50%" }}
        />
      </a>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-full left-1/2 -translate-x-1/2 bg-navy border border-white/[0.08] backdrop-blur-2xl shadow-2xl shadow-black/30 rounded-2xl w-[840px] max-w-[calc(100vw-2rem)] py-3 px-3 z-50 mt-3"
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-navy rotate-45 border-l border-t border-white/[0.08]" />
            <div className="grid grid-cols-4 gap-x-4 gap-y-1">
              {dropdown.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="block min-w-0 px-4 py-2.5 text-sm text-white/70 hover:text-gold hover:bg-white/[0.04] transition-all rounded-lg leading-snug"
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
