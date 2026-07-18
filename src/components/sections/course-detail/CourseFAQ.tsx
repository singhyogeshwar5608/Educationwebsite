"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Course } from "@/data/courses";

interface CourseFAQProps {
  course: Course;
}

export default function CourseFAQ({ course }: CourseFAQProps) {
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
            Find answers to common questions about this course.
          </p>
        </div>

        <div className="space-y-3">
          {course.faqs.map((faq, index) => (
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
