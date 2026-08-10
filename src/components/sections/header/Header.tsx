"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import TopBar from "./TopBar";
import Navbar, { menuItems } from "./Navbar";
import MobileMenu from "./MobileMenu";
import { publicService } from "@/services/public.service";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const { data: categories = [] } = useQuery<{ id: string; name: string; slug: string }[]>({
    queryKey: ["public-course-categories"],
    queryFn: () => publicService.categories.list() as Promise<{ id: string; name: string; slug: string }[]>,
  });

  const mobileItems = useMemo(
    () =>
      menuItems.map((item) =>
        item.label === "Courses"
          ? {
              ...item,
              children: categories.map((c) => ({
                label: c.name,
                href: `/courses?category=${encodeURIComponent(c.name)}`,
              })),
            }
          : item
      ),
    [categories]
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <TopBar scrolled={scrolled} />
      <Navbar
        scrolled={scrolled}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen((prev) => !prev)}
      />
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        items={mobileItems}
      />
    </header>
  );
}
