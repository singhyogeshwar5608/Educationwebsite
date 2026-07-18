"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What courses do you offer?",
    answer:
      "We offer a wide range of industry-focused courses including ADCA (Advanced Diploma in Computer Application), DCA (Diploma in Computer Application), Tally Prime, Digital Marketing, Web Development, Graphic Design, and more. Each course is designed with practical training and industry-relevant curriculum to ensure you are job-ready upon completion.",
  },
  {
    question: "Are the courses certified?",
    answer:
      "Yes, all our courses are government certified. Upon successful completion of your course, you will receive a recognized certificate that is valid across India. Our certifications are accepted by top companies and organizations, giving you a competitive edge in the job market.",
  },
  {
    question: "What are the course fees?",
    answer:
      "Our course fees are very affordable and vary depending on the course duration and content. We offer flexible payment options and installment plans to make education accessible to everyone. Please contact our admissions office or visit our courses page for detailed fee structure of each course.",
  },
  {
    question: "Do you provide placement assistance?",
    answer:
      "Yes, we provide comprehensive placement assistance to all our students. Our dedicated placement cell works with top companies like TCS, Infosys, Wipro, HCL, Tech Mahindra, and Cognizant. We help with resume building, interview preparation, and direct placement opportunities to ensure you land your dream job.",
  },
  {
    question: "What is the class timing and batch schedule?",
    answer:
      "We offer flexible batch timings to accommodate students and working professionals. Morning, afternoon, and evening batches are available. You can choose a batch that suits your schedule. Weekend batches are also available for select courses. Contact us for the current batch schedule.",
  },
  {
    question: "Can I visit the institute before enrolling?",
    answer:
      "Absolutely! We encourage prospective students to visit our campus, meet our trainers, and see our facilities firsthand. You can schedule a campus tour by calling us or filling the contact form on our website. Our admissions team will be happy to show you around and answer any questions you may have.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-light-gray py-16 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-text-gray text-lg">
            Find answers to common questions about our courses and services.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-light-blue/50 transition-colors"
              >
                <span className="font-semibold text-navy pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-navy shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5">
                  <p className="text-text-gray leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
