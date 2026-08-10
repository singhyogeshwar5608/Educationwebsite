import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { publicService } from "@/services/public.service";
import logoImg from "@/assets/Logo/Logo.png";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Teachers", href: "#teachers" },
  { label: "Results", href: "/results" },
  { label: "Verify Certificate", href: "/verification" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact Us", href: "#contact" },
  { label: "Admin Panel", href: "/admin" },
];

const courses = [
  "ADCA",
  "DCA",
  "Tally Prime",
  "Digital Marketing",
  "Web Development",
  "Graphic Design",
  "More Courses",
];

export default function Footer() {
  const [miniForm, setMiniForm] = useState({ name: "", email: "", message: "" });
  const [miniSending, setMiniSending] = useState(false);
  const [miniSent, setMiniSent] = useState(false);
  const [miniError, setMiniError] = useState("");

  const handleMiniSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!miniForm.name.trim() || !miniForm.email.trim() || !miniForm.message.trim()) {
      setMiniError("Please fill in your name, email and message.");
      return;
    }
    setMiniSending(true);
    setMiniError("");
    try {
      await publicService.enquiries.submit({
        name: miniForm.name,
        email: miniForm.email,
        phone: "",
        subject: "Footer Message",
        message: miniForm.message,
      });
      setMiniSent(true);
      setMiniForm({ name: "", email: "", message: "" });
      setTimeout(() => setMiniSent(false), 4000);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors) {
        const messages = Object.values(data.errors).flat();
        setMiniError((messages[0] as string) || "Failed to send message.");
      } else {
        setMiniError(data?.message || data?.error || "Failed to send message. Please try again.");
      }
    } finally {
      setMiniSending(false);
    }
  };

  return (
    <footer className="bg-navy-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-5">
              <img src={logoImg} alt="Z-TECH Career Institute" className="h-[46px] w-auto" />
            </div>
            <p className="text-blue-200/80 text-sm leading-relaxed mb-5">
              Z-TECH CAREER ACADEMY is a leading computer education institute in Kaithal, Haryana. Under the guidance of Vijay Kumar Singla (M.Com, MBA), we are committed to providing quality education and practical training to help students achieve their dreams.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-gold hover:text-navy rounded-lg flex items-center justify-center transition-all" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-gold hover:text-navy rounded-lg flex items-center justify-center transition-all" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-gold hover:text-navy rounded-lg flex items-center justify-center transition-all" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 hover:bg-gold hover:text-navy rounded-lg flex items-center justify-center transition-all" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-blue-200/80 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Courses */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Our Courses</h3>
            <ul className="space-y-2.5">
              {courses.map((course) => (
                <li key={course}>
                  <a
                    href="#courses"
                    className="text-blue-200/80 hover:text-gold text-sm transition-colors"
                  >
                    {course}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-5">Contact Info</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span className="text-blue-200/80 text-sm">
                  Behind Jat School, Rishi Nagar,<br/>Gali No. 9, Kaithal, Haryana
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href="tel:+919215052018" className="text-blue-200/80 hover:text-gold text-sm transition-colors">
                  92150-52018
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href="tel:+918685825071" className="text-blue-200/80 hover:text-gold text-sm transition-colors">
                  86858-25071
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href="mailto:ztca2012@gmail.com" className="text-blue-200/80 hover:text-gold text-sm transition-colors">
                  ztca2012@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gold shrink-0" />
                <span className="text-blue-200/80 text-sm">www.ztechacademy.in</span>
              </li>
            </ul>

            {/* Mini Contact Form */}
            <h4 className="text-white font-semibold text-sm mb-3">Send Us A Message</h4>
            <form onSubmit={handleMiniSubmit} className="space-y-2">
              <input
                type="text"
                placeholder="Your Name"
                value={miniForm.name}
                onChange={(e) => setMiniForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-blue-200/50 focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={miniForm.email}
                onChange={(e) => setMiniForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-blue-200/50 focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <textarea
                placeholder="Your Message"
                rows={2}
                value={miniForm.message}
                onChange={(e) => setMiniForm((p) => ({ ...p, message: e.target.value }))}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-blue-200/50 focus:outline-none focus:ring-1 focus:ring-gold resize-none"
              />
              <button
                type="submit"
                disabled={miniSending}
                className="w-full bg-gold hover:bg-gold-light text-navy font-semibold text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {miniSending ? "Sending..." : "Send Message"}
              </button>
              {miniSent && (
                <p className="flex items-center gap-1.5 text-green-300 text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> Message sent successfully!</p>
              )}
              {miniError && (
                <p className="flex items-center gap-1.5 text-red-300 text-xs"><AlertCircle className="w-3.5 h-3.5" /> {miniError}</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-blue-200/60 text-sm">
            &copy; 2025 Z-TECH CAREER ACADEMY. All Rights Reserved.
          </p>
          <p className="text-blue-200/60 text-sm">
            Owner: Vijay Kumar Singla (M.Com, MBA)
          </p>
        </div>
      </div>
    </footer>
  );
}
