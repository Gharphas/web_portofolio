import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "M Ikhsan Anggara — Full Stack Developer | M ikhsan Anggara",
    template: "%s | M Ikhsan Anggara",
  },
  description:
    "Portfolio pribadi M ikhsan Anggara — Full Stack Developer dengan pengalaman di React, Next.js, Node.js, dan berbagai teknologi modern. Lihat proyek, skill, dan pengalaman saya.",
  keywords: [
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "Web Developer",
    "Indonesia",
  ],
  authors: [{ name: "M Ikhsan Anggara" }],
  creator: "M Ikhsan Anggara",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://M Ikhsan Anggara.com",
    siteName: "M Ikhsan Anggara",
    title: "M Ikhsan Anggara — Full Stack Developer",
    description:
      "Portfolio pribadi M Ikhsan Anggara — Full Stack Developer. Lihat proyek, skill, dan pengalaman saya.",
  },
  twitter: {
    card: "summary_large_image",
    title: "M Ikhsan Anggara — Full Stack Developer",
    description: "Portfolio pribadi M Ikhsan Anggara — Full Stack Developer.",
    creator: "@M Ikhsan Anggara",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${inter.variable}`}
    >
      <body className="min-h-screen bg-background antialiased">
        <LenisProvider>
          <ThemeProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </ThemeProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
