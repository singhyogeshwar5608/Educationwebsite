import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/Logo/Logo.png";
import { useAdmission } from "@/components/admission/AdmissionModal";

interface MobileNavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  items: MobileNavItem[];
}

export function Hamburger({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="lg:hidden w-10 h-10 rounded-xl bg-navy/[0.06] flex items-center justify-center text-navy-dark hover:bg-navy/[0.10] transition-colors"
      aria-label="Toggle menu"
    >
      {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </motion.button>
  );
}

export default function MobileMenu({ open, onClose, items }: MobileMenuProps) {
  const { openAdmission } = useAdmission();
  const [openCourses, setOpenCourses] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 lg:hidden"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="absolute top-0 left-0 right-0 bg-white rounded-b-[28px] shadow-2xl pt-5 pb-8 px-6"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 20px)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <img src={logoImg} alt="Z-TECH" className="h-8 w-auto object-contain" />
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-xl bg-navy/[0.04] text-navy flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              {items.map((item, i) => (
                <div key={item.label}>
                  {item.children && item.children.length > 0 ? (
                    <>
                      <motion.button
                        type="button"
                        onClick={() => setOpenCourses((prev) => !prev)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.04 }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[15px] font-semibold text-navy hover:text-gold hover:bg-navy/[0.03] rounded-xl transition-all"
                      >
                        <span className="flex-1 text-left">{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${openCourses ? "rotate-180" : ""}`}
                        />
                      </motion.button>
                      <AnimatePresence>
                        {openCourses && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            {item.children.map((child, j) => (
                              <motion.a
                                key={child.href}
                                href={child.href}
                                onClick={onClose}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.06 + j * 0.03 }}
                                className="flex items-center gap-3 pl-9 pr-4 py-2.5 text-sm font-medium text-navy/80 hover:text-gold hover:bg-navy/[0.03] rounded-xl transition-all"
                              >
                                {child.label}
                              </motion.a>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <motion.a
                      href={item.href}
                      onClick={onClose}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.04 }}
                      className="flex items-center gap-3 px-4 py-3 text-[15px] font-semibold text-navy hover:text-gold hover:bg-navy/[0.03] rounded-xl transition-all"
                    >
                      {item.label}
                    </motion.a>
                  )}
                </div>
              ))}
            </div>

            <motion.button
              type="button"
              onClick={() => { onClose(); openAdmission(); }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex items-center justify-center gap-4 bg-navy border-[4px] border-[#B6F35C] text-white font-semibold text-[15px] rounded-full shadow-lg mx-2"
              style={{ height: "58px" }}
            >
              <span>Admission Open</span>
              <div className="w-[38px] h-[38px] bg-[#B6F35C] rounded-full flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
