import { useState } from "react";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import ContactHero from "@/components/sections/contact/ContactHero";
import { Phone, Mail, MapPin, Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { publicService } from "@/services/public.service";

export default function Contact() {
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ContactHero />
        <section className="bg-light-blue pb-16 lg:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[60px]">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-navy mb-4">Contact Us</h1>
              <p className="text-text-gray text-lg max-w-xl mx-auto">
                Have questions? We are here to help. Reach out to us.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
              <div className="space-y-6">
                {[
                  { icon: Phone, label: "Phone", value: "92150-52018 / 86858-25071" },
                  { icon: Mail, label: "Email", value: "ztca2012@gmail.com" },
                  { icon: MapPin, label: "Address", value: "Behind Jat School, Rishi Nagar, Gali No. 9, Kaithal, Haryana" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-navy" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy">{item.label}</p>
                      <p className="text-sm text-text-gray">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {(["name", "email", "phone", "subject"] as const).map((field) => (
                    <div key={field} className={field === "subject" ? "sm:col-span-2" : ""}>
                      <input
                        type={field === "email" ? "email" : "text"}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1) + (field !== "subject" ? "*" : "")}
                        value={form[field]}
                        onChange={(e) => update(field, e.target.value)}
                        className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${errors[field] ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-gold/50 focus:border-gold"}`}
                      />
                      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                    </div>
                  ))}
                </div>
                <div>
                  <textarea
                    placeholder="Your Message*"
                    rows={5}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all resize-none ${errors.message ? "border-red-300 focus:ring-red-200" : "border-gray-200 focus:ring-gold/50 focus:border-gold"}`}
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
