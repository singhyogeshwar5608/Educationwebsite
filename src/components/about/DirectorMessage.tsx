import { Quote } from "lucide-react";

export default function DirectorMessage() {
  return (
    <section className="bg-light-gray py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
            Leadership
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">
            Message From Our Director
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 border border-gray-100 relative">
            <Quote className="w-12 h-12 text-gold/20 absolute top-6 left-6" />

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Director Photo */}
              <div className="shrink-0">
                <div className="w-32 h-32 rounded-xl overflow-hidden shadow-md">
                  <img
                    src="https://sfile.chatglm.cn/images-ppt/03652fc7ba0d.jpg"
                    alt="Vijay Kumar Singla - Director of Z-TECH CAREER ACADEMY"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="flex-1">
                <p className="text-text-gray leading-relaxed mb-4 text-lg italic">
                  &ldquo;At Z-TECH CAREER ACADEMY, we believe that education is not
                  just about acquiring knowledge — it is about developing the
                  skills, confidence, and mindset needed to thrive in
                  today&apos;s competitive world. Our mission has always been to
                  provide quality, practical education that transforms lives and
                  opens doors to new opportunities.&rdquo;
                </p>
                <p className="text-text-gray leading-relaxed mb-6">
                  Since our founding, we have remained committed to maintaining
                  the highest standards of training and placement support. Every
                  course we offer is carefully crafted to meet industry demands,
                  and every student who walks through our doors receives
                  personalized attention and guidance. I invite you to join our
                  community and take the first step toward a brighter future.
                </p>
                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-navy font-bold text-lg">Vijay Kumar Singla</h4>
                  <p className="text-text-gray text-sm">M.Com, MBA — Founder & Director</p>
                  <p className="text-navy-light text-sm font-medium">
                    Z-TECH CAREER ACADEMY
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
