"use client";

import { useState, useRef, useEffect, useMemo, createContext, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CheckCircle2, AlertCircle, X, GraduationCap, Search, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { publicService } from "@/services/public.service";
import type { Course } from "@/data/courses";

const admissionSchema = z.object({
  studentName: z.string().min(1, "Student name is required"),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Please select gender"),
  mobile: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
  email: z.union([z.email("Invalid email address"), z.literal("")]).optional(),
  address: z.string().optional(),
  courseId: z.string().min(1, "Please select a course"),
  batch: z.string().optional(),
});

type AdmissionFormValues = z.infer<typeof admissionSchema>;

const defaultValues: AdmissionFormValues = {
  studentName: "", fatherName: "", motherName: "", dob: "", gender: "",
  mobile: "", email: "", address: "", courseId: "", batch: "",
};

interface AdmissionContextValue {
  openAdmission: () => void;
}

const AdmissionContext = createContext<AdmissionContextValue>({ openAdmission: () => {} });

export const useAdmission = () => useContext(AdmissionContext);

const inputCls =
  "w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all bg-white border-gray-200 focus:ring-gold/50 focus:border-gold";
const labelCls = "block text-sm font-medium text-navy mb-1.5";
const errCls = "text-red-500 text-xs mt-1";

function HighlightText({ text, search }: { text: string; search: string }) {
  if (!search.trim()) return <>{text}</>;
  const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-gold/40 text-navy font-semibold rounded-sm px-0.5">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function AdmissionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionSchema),
    defaultValues,
  });
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const courseDropdownRef = useRef<HTMLDivElement>(null);
  const courseSearchRef = useRef<HTMLInputElement>(null);
  const courseIdValue = watch("courseId");

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["public-courses-all"],
    queryFn: () => publicService.courses.list() as Promise<Course[]>,
  });

  const filteredCourses = useMemo(() => {
    if (!courseSearch.trim()) return courses;
    const lower = courseSearch.toLowerCase();
    return courses.filter((c) => c.title.toLowerCase().includes(lower));
  }, [courses, courseSearch]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (courseDropdownRef.current && !courseDropdownRef.current.contains(e.target as Node)) {
        setCourseDropdownOpen(false);
      }
    }
    if (courseDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [courseDropdownOpen]);

  const onSubmit = async (values: AdmissionFormValues) => {
    setServerError("");
    try {
      await publicService.admissions.submit(values);
      setSubmitted(true);
      setTimeout(() => onClose(), 3500);
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors) {
        Object.entries(data.errors).forEach(([key, msgs]) => {
          setError(key as keyof AdmissionFormValues, { message: (msgs as string[])[0] });
        });
      } else {
        setServerError(data?.message || data?.error || "Failed to submit. Please try again.");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); setSubmitted(false); setServerError(""); setCourseSearch(""); setCourseDropdownOpen(false); reset(defaultValues); } }}>
      <DialogContent className="max-w-lg rounded-2xl border-0 p-0 gap-0 overflow-hidden" showCloseButton={false}>
        {/* Header */}
        <div className="bg-navy px-6 py-5 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-navy" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Admission Application</h2>
              <p className="text-blue-200/70 text-xs mt-0.5">Apply now — our admissions team will contact you soon</p>
            </div>
          </div>
          <DialogClose asChild>
            <button
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </DialogClose>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green" />
            </div>
            <h3 className="text-lg font-bold text-navy mb-2">Thank You!</h3>
            <p className="text-text-gray text-sm leading-relaxed max-w-sm mx-auto">
              Your admission request has been submitted. Our team will contact you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 max-h-[70vh] overflow-y-auto">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className={labelCls}>Student Name <span className="text-red-500">*</span></label>
                <input type="text" {...register("studentName")} placeholder="Enter full name" className={inputCls} />
                {errors.studentName && <p className={errCls}>{errors.studentName.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Father&apos;s Name</label>
                <input type="text" {...register("fatherName")} placeholder="Father&apos;s name" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Mother&apos;s Name</label>
                <input type="text" {...register("motherName")} placeholder="Mother&apos;s name" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Date of Birth <span className="text-red-500">*</span></label>
                <input type="date" {...register("dob")} className={inputCls} />
                {errors.dob && <p className={errCls}>{errors.dob.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Gender <span className="text-red-500">*</span></label>
                <select {...register("gender")} className={inputCls}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className={errCls}>{errors.gender.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Mobile <span className="text-red-500">*</span></label>
                <input type="tel" {...register("mobile")} placeholder="10-digit mobile number" className={inputCls} />
                {errors.mobile && <p className={errCls}>{errors.mobile.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" {...register("email")} placeholder="you@example.com" className={inputCls} />
                {errors.email && <p className={errCls}>{errors.email.message}</p>}
              </div>
              <div>
                <label className={labelCls}>Preferred Batch</label>
                <input type="text" {...register("batch")} placeholder="e.g. 2025-2026" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Address</label>
                <input type="text" {...register("address")} placeholder="Full address" className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Course <span className="text-red-500">*</span></label>
                <div className="relative" ref={courseDropdownRef}>
                  <div
                    className={`flex items-center w-full bg-white border rounded-xl focus-within:ring-2 focus-within:ring-gold/50 focus-within:border-gold transition-all cursor-text ${errors.courseId ? 'border-red-300' : 'border-gray-200'}`}
                    onClick={() => { setCourseDropdownOpen(true); setTimeout(() => courseSearchRef.current?.focus(), 0); }}
                  >
                    <BookOpen className="ml-4 w-4 h-4 text-gray-400 shrink-0" />
                    {courseIdValue ? (
                      <span className="flex-1 px-3 py-3 text-sm text-gray-900 truncate">
                        {courses.find((c) => String(c.id) === String(courseIdValue))?.title || "Selected"}
                      </span>
                    ) : (
                      <span className="flex-1 px-3 py-3 text-sm text-gray-400 select-none">Select Course</span>
                    )}
                    <button
                      type="button"
                      className="px-3 py-3 text-gray-400 hover:text-gray-600"
                      onClick={(e) => { e.stopPropagation(); setCourseDropdownOpen((o) => !o); if (!courseDropdownOpen) setTimeout(() => courseSearchRef.current?.focus(), 0); }}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  {courseDropdownOpen && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input
                            ref={courseSearchRef}
                            type="text"
                            placeholder="Search courses..."
                            value={courseSearch}
                            onChange={(e) => setCourseSearch(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredCourses.length === 0 ? (
                          <div className="px-3 py-4 text-center text-sm text-gray-400">No courses found</div>
                        ) : (
                          filteredCourses.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gold/10 transition-colors ${String(c.id) === String(courseIdValue) ? 'bg-gold/15 text-navy font-semibold' : 'text-gray-700'}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setValue("courseId", String(c.id), { shouldValidate: true });
                                setCourseDropdownOpen(false);
                                setCourseSearch("");
                              }}
                            >
                              <BookOpen className="w-3.5 h-3.5 shrink-0 opacity-50" />
                              <span className="truncate"><HighlightText text={c.title} search={courseSearch} /></span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {errors.courseId && <p className={errCls}>{errors.courseId.message}</p>}
              </div>
            </div>

            {serverError && (
              <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 rounded-lg px-4 py-3 text-sm font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" /> {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3 rounded-xl transition-all hover:shadow-lg disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4" />}
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function AdmissionProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <AdmissionContext.Provider value={{ openAdmission: () => setOpen(true) }}>
      {children}
      <AdmissionModal open={open} onClose={() => setOpen(false)} />
    </AdmissionContext.Provider>
  );
}
