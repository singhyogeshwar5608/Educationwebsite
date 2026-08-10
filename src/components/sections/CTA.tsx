import { useState } from "react";
import { Phone, MessageCircle, Mail, Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { publicService } from "@/services/public.service";

export default function CTA() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit phone number";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitError("");
    try {
      await publicService.enquiries.submit({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: form.subject,
        message: form.message,
      });
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors) {
        const messages = Object.values(data.errors).flat();
        setSubmitError((messages[0] as string) || "Failed to send message. Please try again.");
      } else {
        setSubmitError(data?.message || data?.error || "Failed to send message. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const update = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  };

  const inputCls = (field: string) =>
    `w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
      errors[field] ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-gold/50 focus:border-gold"
    }`;

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
                href="tel:+919215052018"
                className="flex items-center gap-3 text-white hover:text-gold transition-colors"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <span>92150-52018</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-white hover:text-gold transition-colors"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span>WhatsApp: 86858-25071</span>
              </a>
              <a
                href="mailto:ztca2012@gmail.com"
                className="flex items-center gap-3 text-white hover:text-gold transition-colors"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <span>ztca2012@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <h3 className="text-xl font-bold text-navy mb-1">Send an Inquiry</h3>
            <p className="text-sm text-text-gray mb-6">
              Fill in the form and our team will get back to you shortly.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Name*"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className={inputCls("name")}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email*"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputCls("email")}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="tel"
                    placeholder="Phone*"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={inputCls("phone")}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Subject"
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    className={inputCls("subject")}
                  />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>
              </div>
              <div>
                <textarea
                  placeholder="Your Message*"
                  rows={4}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  className={`${inputCls("message")} resize-none`}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {loading ? "Sending..." : "Send Message"}
              </button>
              {submitError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-lg px-4 py-3 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {submitError}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-green bg-green/10 rounded-lg px-4 py-3 text-sm font-medium">
                  <CheckCircle className="w-4 h-4" /> Message sent successfully! We will get back to you soon.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
