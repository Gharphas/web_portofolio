import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GlobalRibbons } from "@/components/GlobalRibbons";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jemi Arian — Full Stack Developer | JemiArian",
    template: "%s | JemiArian",
  },
  description:
    "Portfolio pribadi Jemi Arian — Full Stack Developer dengan pengalaman di React, Next.js, Node.js, dan berbagai teknologi modern. Lihat proyek, skill, dan pengalaman saya.",
  keywords: [
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "Web Developer",
    "Indonesia",
  ],
  authors: [{ name: "Jemi Arian" }],
  creator: "Jemi Arian",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://jemiarian.com",
    siteName: "JemiArian",
    title: "Jemi Arian — Full Stack Developer",
    description:
      "Portfolio pribadi Jemi Arian — Full Stack Developer. Lihat proyek, skill, dan pengalaman saya.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jemi Arian — Full Stack Developer",
    description: "Portfolio pribadi Jemi Arian — Full Stack Developer.",
    creator: "@jemiarian",
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
        <ThemeProvider>
          <TooltipProvider>
            <GlobalRibbons />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
