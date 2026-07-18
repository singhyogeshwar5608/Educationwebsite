import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Send,
} from "lucide-react";

const quickLinks = [
  "Home",
  "About Us",
  "Courses",
  "Teachers",
  "Results",
  "Verify Certificate",
  "Gallery",
  "Contact Us",
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
  return (
    <footer className="bg-navy-dark text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-navy" />
              </div>
              <div className="leading-tight">
                <span className="text-white font-bold text-lg tracking-tight block">
                  Z-TECH CAREER
                </span>
                <span className="text-blue-300 text-[10px] font-medium tracking-widest uppercase">
                  Institute
                </span>
              </div>
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
                <li key={link}>
                  <a
                    href="#"
                    className="text-blue-200/80 hover:text-gold text-sm transition-colors"
                  >
                    {link}
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
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-blue-200/50 focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-blue-200/50 focus:outline-none focus:ring-1 focus:ring-gold"
              />
              <textarea
                placeholder="Your Message"
                rows={2}
                className="w-full bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-blue-200/50 focus:outline-none focus:ring-1 focus:ring-gold resize-none"
              />
              <button className="w-full bg-gold hover:bg-gold-light text-navy font-semibold text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
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
