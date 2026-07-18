"use client";

import { Users, BookOpen, TrendingUp, Award } from "lucide-react";

const stats = [
  { icon: Users, value: "5000+", label: "Happy Students", color: "bg-blue-50 text-blue-600" },
  { icon: BookOpen, value: "40+", label: "Courses Offered", color: "bg-green-50 text-green-600" },
  { icon: TrendingUp, value: "95%", label: "Success Rate", color: "bg-purple-50 text-purple-600" },
  { icon: Award, value: "15+", label: "Expert Trainers", color: "bg-orange-50 text-orange-600" },
];

export default function Hero() {
  return (
    <section className="relative bg-light-blue overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100/30 rounded-full translate-y-1/2 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-blue-50/50 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-navy/10 text-navy text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              Admissions Open 2025
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-navy leading-tight mb-6">
              Learn Today,{" "}
              <span className="text-navy-light relative">
                Lead
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M2 6C50 2 150 2 198 6"
                    stroke="#FFC107"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              Tomorrow
            </h1>
            <p className="text-text-gray text-lg leading-relaxed mb-8 max-w-lg">
              Join industry-focused courses designed to build in-demand skills and
              shape your successful career. Get certified, get placed, get ahead.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#courses"
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-7 py-3 rounded-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
              >
                Explore Courses
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-navy border-2 border-navy font-semibold px-7 py-3 rounded-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative z-10 hidden lg:block">
            <div className="relative">
              {/* Main image */}
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://sfile.chatglm.cn/images-ppt/85b1aa8bc748.jpg"
                  alt="Happy students learning together at Future Skills Institute"
                  className="w-full h-[420px] object-cover"
                />
              </div>
              {/* Floating card - top right */}
              <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-xl p-4 z-20 animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-navy">95%</p>
                    <p className="text-xs text-text-gray">Success Rate</p>
                  </div>
                </div>
              </div>
              {/* Floating card - bottom left */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl p-4 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-navy">5000+</p>
                    <p className="text-xs text-text-gray">Students Trained</p>
                  </div>
                </div>
              </div>
              {/* Background decorative shape */}
              <div className="absolute -inset-4 bg-gradient-to-br from-navy/5 to-navy-light/5 rounded-2xl -z-0" />
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 relative z-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div
                className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3`}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-navy">{stat.value}</p>
              <p className="text-sm text-text-gray mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
