// ═══════════════════════════════════════════
// TypeScript Interfaces — Database & API Types
// Matches Supabase schema and Express API contracts
// ═══════════════════════════════════════════

// ─── About ───
export interface About {
  id: string;
  title: string;
  subtitle?: string | null;
  bio_short?: string | null;
  bio_full?: string | null;
  photo_url?: string | null;
  resume_url?: string | null;
  location?: string | null;
  birthdate?: string | null;
  tagline?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ─── Skills ───
export interface Skill {
  id: string;
  name: string;
  category: string;
  icon_url?: string | null;
  proficiency: number;
  is_featured: boolean;
  sort_order: number;
  color?: string | null;
  created_at?: string;
  updated_at?: string;
}

// ─── Projects ───
export type ProjectStatus = "in_progress" | "completed" | "archived";

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description?: string | null;
  thumbnail_url?: string | null;
  live_url?: string | null;
  github_url?: string | null;
  tech_stack: string[];
  category: string;
  status: ProjectStatus;
  is_featured: boolean;
  start_date?: string | null;
  end_date?: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

// ─── Experience ───
export type ExperienceType = "work" | "freelance" | "volunteer" | "internship";

export interface Experience {
  id: string;
  type: ExperienceType;
  title: string;
  company: string;
  location?: string | null;
  description?: string | null;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  logo_url?: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

// ─── Education ───
export interface Education {
  id: string;
  institution: string;
  degree?: string | null;
  field_of_study?: string | null;
  start_date: string;
  end_date?: string | null;
  is_current: boolean;
  description?: string | null;
  logo_url?: string | null;
  grade?: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

// ─── Achievements ───
export interface Achievement {
  id: string;
  title: string;
  issuer?: string | null;
  description?: string | null;
  date_received: string;
  certificate_url?: string | null;
  badge_url?: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

// ─── Hobbies ───
export interface Hobby {
  id: string;
  name: string;
  description?: string | null;
  icon_name?: string | null;
  image_url?: string | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

// ─── Photos ───
export interface Photo {
  id: string;
  title?: string | null;
  url: string;
  caption?: string | null;
  category: string;
  is_profile: boolean;
  sort_order: number;
  width?: number | null;
  height?: number | null;
  created_at?: string;
  updated_at?: string;
}

// ─── Contact Messages ───
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  is_read: boolean;
  is_starred: boolean;
  created_at?: string;
}

// ─── Social Links ───
export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon_name?: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

// ─── Site Settings ───
export interface SiteSetting {
  id: string;
  key: string;
  value: any;
  category: string;
  created_at?: string;
  updated_at?: string;
}

// ═══════════════════════════════════════════
// API Response Types
// ═══════════════════════════════════════════

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface AuthResponse {
  success: boolean;
  data?: {
    token: string;
    refreshToken?: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}
