import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Orbitron } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Rian — Full Stack Developer | RianPedia",
    template: "%s | RianPedia",
  },
  description:
    "Portfolio pribadi Rian — Full Stack Developer dengan pengalaman di React, Next.js, Node.js, dan berbagai teknologi modern. Lihat proyek, skill, dan pengalaman saya.",
  keywords: [
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Portfolio",
    "Web Developer",
    "Indonesia",
  ],
  authors: [{ name: "Rian" }],
  creator: "Rian",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://rianpedia.com",
    siteName: "RianPedia",
    title: "Rian — Full Stack Developer",
    description:
      "Portfolio pribadi Rian — Full Stack Developer. Lihat proyek, skill, dan pengalaman saya.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rian — Full Stack Developer",
    description: "Portfolio pribadi Rian — Full Stack Developer.",
    creator: "@rian",
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
      className={`${inter.variable} ${jetbrainsMono.variable} ${orbitron.variable}`}
    >
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
