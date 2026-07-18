"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
  GraduationCap,
  ChevronDown,
} from "lucide-react";

const topBarInfo = {
  phone: "+91 98765 43210",
  email: "info@fsi.edu.in",
};

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Courses", href: "#courses", hasDropdown: true },
  { label: "Teachers", href: "#teachers" },
  { label: "Results", href: "#results" },
  { label: "Verify Certificate", href: "#certificate" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
];

const courseDropdown = [
  "ADCA - Advanced Diploma in Computer Application",
  "DCA - Diploma in Computer Application",
  "Tally Prime - Accounting with Tally Prime",
  "Digital Marketing",
  "Web Development",
  "Graphic Design",
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Top Info Bar */}
      <div className="bg-navy text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href={`tel:${topBarInfo.phone}`}
              className="flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{topBarInfo.phone}</span>
            </a>
            <a
              href={`mailto:${topBarInfo.email}`}
              className="flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{topBarInfo.email}</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-gold font-semibold text-xs tracking-wide uppercase">
              Admissions Open 2025
            </span>
            <div className="flex items-center gap-2 ml-2">
              <a href="#" className="hover:text-gold transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-gold transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-gold transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-gold" />
            </div>
            <div className="leading-tight">
              <span className="text-navy font-bold text-lg tracking-tight block">
                FUTURE SKILLS
              </span>
              <span className="text-navy-light text-[10px] font-medium tracking-widest uppercase">
                Institute
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.hasDropdown ? (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setCoursesOpen(true)}
                  onMouseLeave={() => setCoursesOpen(false)}
                >
                  <a
                    href={item.href}
                    className="flex items-center gap-0.5 px-3 py-2 text-sm font-medium text-navy hover:text-navy-light transition-colors"
                  >
                    {item.label}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </a>
                  {coursesOpen && (
                    <div className="absolute top-full left-0 bg-white shadow-xl rounded-lg border border-gray-100 min-w-[280px] py-2 z-50">
                      {courseDropdown.map((course) => (
                        <a
                          key={course}
                          href="#courses"
                          className="block px-4 py-2.5 text-sm text-text-gray hover:bg-light-blue hover:text-navy transition-colors"
                        >
                          {course}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-navy hover:text-navy-light transition-colors"
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-semibold text-sm px-5 py-2.5 rounded-lg transition-all hover:shadow-lg"
            >
              Admission Open
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-navy hover:bg-light-blue rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-navy hover:bg-light-blue hover:text-navy-light rounded-lg transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-3">
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-gold hover:bg-gold-light text-navy font-semibold text-sm px-5 py-2.5 rounded-lg transition-all"
                >
                  Admission Open
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
