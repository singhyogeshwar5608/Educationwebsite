"use client";

import { useState } from "react";
import { ChevronDown, BookOpen, Clock } from "lucide-react";
import { Course } from "@/data/courses";

interface CourseSyllabusProps {
  course: Course;
}

export default function CourseSyllabus({ course }: CourseSyllabusProps) {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section id="syllabus" className="bg-white py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
            Curriculum
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">
            Course Syllabus
          </h2>
          <p className="text-text-gray text-lg max-w-xl mx-auto">
            A structured learning path with {course.syllabus.length} comprehensive modules
            covering all essential topics.
          </p>
        </div>

        <div className="space-y-3">
          {course.syllabus.map((module, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-light-blue/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Module Number */}
                  <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-navy block">{module.title}</span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-text-gray">
                        <BookOpen className="w-3.5 h-3.5" />
                        {module.topics.length} Topics
                      </span>
                      <span className="flex items-center gap-1 text-xs text-text-gray">
                        <Clock className="w-3.5 h-3.5" />
                        {module.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-navy shrink-0 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 pt-0">
                  <div className="border-t border-gray-100 pt-4">
                    <ul className="space-y-2.5">
                      {module.topics.map((topic, tIndex) => (
                        <li key={tIndex} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                          <span className="text-text-gray text-sm">{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
