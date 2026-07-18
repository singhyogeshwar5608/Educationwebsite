import { Phone, MessageCircle, Mail, ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section id="contact" className="bg-navy py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Have Questions? We Are Here To Help!
            </h2>
            <p className="text-blue-200 text-lg leading-relaxed mb-8">
              Whether you want to know more about our courses, fees, or admission
              process, our team is ready to assist you. Get in touch with us today.
            </p>
            <div className="space-y-4 mb-8">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-3 text-white hover:text-gold transition-colors"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <span>+91 98765 43210</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-white hover:text-gold transition-colors"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span>WhatsApp: +91 98765 43210</span>
              </a>
              <a
                href="mailto:info@fsi.edu.in"
                className="flex items-center gap-3 text-white hover:text-gold transition-colors"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <span>info@fsi.edu.in</span>
              </a>
            </div>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold-light text-navy font-bold px-8 py-3.5 rounded-lg transition-all hover:shadow-xl text-lg"
            >
              Contact Us Now
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>

          {/* Image */}
          <div className="hidden lg:block">
            <div className="relative">
              <img
                src="https://sfile.chatglm.cn/images-ppt/07d860c37858.jpg"
                alt="Group of students with teacher"
                className="rounded-2xl shadow-2xl w-full h-[350px] object-cover"
              />
              <div className="absolute -inset-3 bg-gradient-to-br from-gold/10 to-navy-light/10 rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
