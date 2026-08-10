import { useMemo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Logo from "./Logo";
import NavItem from "./NavItem";
import { Hamburger } from "./MobileMenu";
import { useAdmission } from "@/components/admission/AdmissionModal";
import { publicService } from "@/services/public.service";

interface MenuItem {
  label: string;
  href: string;
  dropdown?: { label: string; href: string }[];
}

const menuItems: MenuItem[] = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Results", href: "/results" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

interface NavbarProps {
  scrolled: boolean;
  onToggleMobile: () => void;
  mobileOpen: boolean;
}

export default function Navbar({ scrolled, onToggleMobile, mobileOpen }: NavbarProps) {
  const { openAdmission } = useAdmission();

  const { data: categories = [] } = useQuery<{ id: string; name: string; slug: string }[]>({
    queryKey: ["public-course-categories"],
    queryFn: () => publicService.categories.list() as Promise<{ id: string; name: string; slug: string }[]>,
  });

  const items = useMemo(
    () =>
      menuItems.map((item) =>
        item.label === "Courses"
          ? {
              ...item,
              dropdown: [
                { label: "All Courses", href: "/courses" },
                ...categories.map((c) => ({
                  label: c.name,
                  href: `/courses?category=${encodeURIComponent(c.name)}`,
                })),
              ],
            }
          : item
      ),
    [categories]
  );

  return (
    <motion.div
      className="w-full flex items-center px-6 lg:px-8 bg-white lg:!bg-transparent"
      style={{
        height: "72px",
        backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
      }}
      animate={{
        backgroundColor: scrolled
          ? "rgba(255, 255, 255, 1)"
          : "rgba(10, 38, 71, 0)",
        boxShadow: scrolled
          ? "0 8px 32px rgba(0,0,0,0.12)"
          : "0 0 0 transparent",
      }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {/* Logo */}
      <div className="relative z-10" style={{ flex: "0 0 auto" }}>
        <Logo />
      </div>

      {/* Center Menu */}
      <div
        className="hidden lg:flex items-center justify-center"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          gap: "42px",
        }}
      >
        {items.map((item) => (
          <NavItem key={item.label} label={item.label} href={item.href} dropdown={item.dropdown} />
        ))}
      </div>

      {/* CTA + Hamburger */}
      <div className="relative z-10 flex items-center gap-3 ml-auto">
        <motion.button
          type="button"
          onClick={openAdmission}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="group hidden lg:inline-flex items-center gap-4 bg-navy border-[4px] border-[#B6F35C] text-white font-semibold text-[15px] rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
          style={{ height: "58px", padding: "0 30px", lineHeight: "58px" }}
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            Admission Open
          </span>
          <div className="w-[38px] h-[38px] bg-[#B6F35C] rounded-full flex items-center justify-center transition-transform duration-300 shrink-0 group-hover:translate-x-[6px]">
            <svg className="w-4 h-4 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </motion.button>
        <Hamburger open={mobileOpen} onClick={onToggleMobile} />
      </div>
    </motion.div>
  );
}

export { menuItems };
