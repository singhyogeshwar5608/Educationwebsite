import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Future Skills Institute - Learn Today, Lead Tomorrow",
  description:
    "Join industry-focused courses designed to build in-demand skills and shape your successful career. Government certified courses with placement assistance.",
  keywords: [
    "Future Skills Institute",
    "Computer Courses",
    "ADCA",
    "DCA",
    "Tally Prime",
    "Digital Marketing",
    "Web Development",
    "Placement Assistance",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} antialiased bg-white text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
