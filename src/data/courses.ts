export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  durationMonths: number;
  price: string;
  priceValue: number;
  rating: number;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  featured: boolean;
  popular: boolean;
  students: number;
  icon?: React.ComponentType<{ className?: string }>;
  // Detail page fields
  registrationFee: string;
  description: string;
  longDescription: string;
  features: string[];
  syllabus: SubjectSyllabus[];
  subjects: string[];
  eligibility: string[];
  gallery: string[];
}

export interface SubjectSyllabus {
  id: string;
  name: string;
  topics: SyllabusTopic[];
}

export interface SyllabusTopic {
  topic: string;
  description?: string | null;
}

export const levelColors: Record<string, string> = {
  Beginner: "bg-green/10 text-green",
  Intermediate: "bg-gold/10 text-navy",
  Advanced: "bg-navy/10 text-navy",
};
