"use client";

import { useState } from "react";
import { ChevronDown, BookOpen, Layers, FileText } from "lucide-react";
import { Course } from "@/data/courses";

interface CourseSyllabusProps {
  course: Course;
}

export default function CourseSyllabus({ course }: CourseSyllabusProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const totalTopics = course.syllabus.reduce((sum, subj) => sum + subj.topics.length, 0);

  return (
    <section id="syllabus" className="bg-white pt-10 pb-16 lg:pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-navy-light font-semibold text-sm uppercase tracking-wider">
            Curriculum
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-navy mt-2 mb-4">
            Course Syllabus
          </h2>
          <p className="text-text-gray text-lg max-w-xl mx-auto">
            A structured learning path across {course.syllabus.length} subjects
            covering {totalTopics} essential topics.
          </p>
        </div>

        {/* Subjects Covered */}
        {course.subjects && course.subjects.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-navy mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-gold" />
              Subjects Covered
            </h3>
            <p className="text-text-gray text-sm mb-5">
              These subjects are taught as part of this course.
            </p>
            <div className="flex flex-wrap gap-2">
              {course.subjects.map((name, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-navy/[0.06] text-navy text-sm font-medium px-3 py-1.5 rounded-full border border-navy/10"
                >
                  <span className="w-1.5 h-1.5 bg-gold rounded-full shrink-0" />
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {course.syllabus.length > 0 ? (
          <div className="space-y-3">
            {course.syllabus.map((subject, index) => (
              <div
                key={subject.id || index}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-light-blue/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Subject Number */}
                    <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-sm">{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-navy block">{subject.name}</span>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-text-gray">
                          <BookOpen className="w-3.5 h-3.5" />
                          {subject.topics.length} Topics
                        </span>
                        <span className="flex items-center gap-1 text-xs text-text-gray">
                          <FileText className="w-3.5 h-3.5" />
                          Topic + Description
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
                      {subject.topics.length > 0 ? (
                        <ul className="space-y-3">
                          {subject.topics.map((topic, tIndex) => (
                            <li key={tIndex} className="flex items-start gap-3">
                              <div className="w-1.5 h-1.5 bg-gold rounded-full shrink-0 mt-2" />
                              <div>
                                <p className="text-text-dark font-medium text-sm">{topic.topic}</p>
                                {topic.description && (
                                  <p className="text-text-gray text-xs mt-0.5 leading-relaxed">{topic.description}</p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-text-gray text-sm">Syllabus add kiya ja raha hai — jald hi available hoga.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-gray">Syllabus available nahi hai.</p>
          </div>
        )}
      </div>
    </section>
  );
}
