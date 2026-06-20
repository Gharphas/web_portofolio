// ─── Navigation ───
export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Gallery", href: "#gallery" },
  { label: "Contact", href: "#contact" },
] as const;

// ─── Site Config ───
export const SITE_CONFIG = {
  name: "RianPedia",
  title: "Rian — Full Stack Developer",
  description:
    "Portfolio pribadi Rian — Full Stack Developer dengan pengalaman di React, Next.js, Node.js, dan berbagai teknologi modern.",
  url: "https://rianpedia.com",
  ogImage: "/og-image.png",
};

// ─── 3D Performance Tiers ───
export const PARTICLE_COUNT = {
  mobile: 50,
  tablet: 100,
  desktop: 200,
} as const;

// ─── Skill Categories ───
export const SKILL_CATEGORIES = [
  "All",
  "Frontend",
  "Backend",
  "Mobile",
  "DevOps",
  "Tools",
] as const;

// ─── Project Categories ───
export const PROJECT_CATEGORIES = [
  "All",
  "Web",
  "Mobile",
  "Desktop",
  "API",
  "Other",
] as const;

// ─── Admin Sidebar Items ───
export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "About Me", href: "/manage-about", icon: "User" },
  { label: "Skills", href: "/manage-skills", icon: "Wrench" },
  { label: "Projects", href: "/manage-projects", icon: "FolderOpen" },
  { label: "Experience", href: "/manage-experience", icon: "Briefcase" },
  { label: "Education", href: "/manage-education", icon: "GraduationCap" },
  { label: "Hobbies", href: "/manage-hobbies", icon: "Gamepad2" },
  { label: "Photos", href: "/manage-photos", icon: "Camera" },
  { label: "Messages", href: "/manage-contact", icon: "Mail" },
  { label: "Social Links", href: "/manage-socials", icon: "Link" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;
