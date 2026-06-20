import { z } from "zod";

// Helper schemas
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD").or(z.literal("")).nullable().optional();

// 1. Auth Schemas
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Format email tidak valid"),
    password: z.string().min(6, "Password minimal 6 karakter"),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6, "Password lama minimal 6 karakter"),
    newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
  }),
});

// 2. About Schemas
export const aboutSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Judul (Title) harus diisi"),
    subtitle: z.string().optional(),
    bio_short: z.string().optional(),
    bio_full: z.string().optional(),
    photo_url: z.string().optional(),
    resume_url: z.string().optional(),
    location: z.string().optional(),
    birthdate: dateSchema,
    tagline: z.string().optional(),
  }),
});

// 3. Skills Schemas
export const skillSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Nama keahlian harus diisi"),
    category: z.string().min(1, "Kategori harus diisi"),
    icon_url: z.string().optional().nullable(),
    proficiency: z.number().min(0).max(100, "Proficiency berkisar antara 0 - 100"),
    is_featured: z.boolean().default(false),
    sort_order: z.number().default(0),
    color: z.string().optional().nullable(),
  }),
});

export const skillReorderSchema = z.object({
  body: z.object({
    orders: z.array(
      z.object({
        id: z.string().uuid("ID keahlian harus berupa UUID"),
        sort_order: z.number(),
      })
    ),
  }),
});

// 4. Projects Schemas
export const projectSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Judul proyek harus diisi"),
    slug: z.string().min(1, "Slug proyek harus diisi"),
    description: z.string().min(1, "Deskripsi singkat harus diisi"),
    long_description: z.string().optional().nullable(),
    thumbnail_url: z.string().optional().nullable(),
    live_url: z.string().optional().nullable(),
    github_url: z.string().optional().nullable(),
    tech_stack: z.array(z.string()).default([]),
    category: z.string().min(1, "Kategori harus diisi"),
    status: z.enum(["in_progress", "completed", "archived"]).default("completed"),
    is_featured: z.boolean().default(false),
    start_date: dateSchema,
    end_date: dateSchema,
    sort_order: z.number().default(0),
  }),
});

// 5. Experience Schemas
export const experienceSchema = z.object({
  body: z.object({
    type: z.enum(["work", "freelance", "volunteer", "internship"]),
    title: z.string().min(1, "Judul jabatan/posisi harus diisi"),
    company: z.string().min(1, "Nama perusahaan/organisasi harus diisi"),
    location: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
    end_date: dateSchema,
    is_current: z.boolean().default(false),
    logo_url: z.string().optional().nullable(),
    sort_order: z.number().default(0),
  }),
});

// 6. Education Schemas
export const educationSchema = z.object({
  body: z.object({
    institution: z.string().min(1, "Nama institusi/kampus harus diisi"),
    degree: z.string().optional().nullable(),
    field_of_study: z.string().optional().nullable(),
    start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
    end_date: dateSchema,
    is_current: z.boolean().default(false),
    description: z.string().optional().nullable(),
    logo_url: z.string().optional().nullable(),
    grade: z.string().optional().nullable(),
    sort_order: z.number().default(0),
  }),
});

// 7. Hobbies Schemas
export const hobbySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Nama hobi harus diisi"),
    description: z.string().optional().nullable(),
    icon_name: z.string().optional().nullable(),
    image_url: z.string().optional().nullable(),
    sort_order: z.number().default(0),
  }),
});

// 8. Photos Schemas
export const photoSchema = z.object({
  body: z.object({
    title: z.string().optional().nullable(),
    url: z.string().min(1, "URL foto harus diisi"),
    caption: z.string().optional().nullable(),
    category: z.string().default("casual"),
    is_profile: z.boolean().default(false),
    sort_order: z.number().default(0),
    width: z.number().optional().nullable(),
    height: z.number().optional().nullable(),
  }),
});

// 9. Contact Schemas
export const contactMessageSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Nama harus diisi"),
    email: z.string().email("Format email tidak valid"),
    subject: z.string().optional().nullable(),
    message: z.string().min(1, "Isi pesan harus diisi"),
  }),
});

// 10. Site Settings Schemas
export const settingSchema = z.object({
  body: z.object({
    value: z.any(),
    category: z.string().default("general"),
  }),
});

export const bulkSettingsSchema = z.object({
  body: z.object({
    settings: z.array(
      z.object({
        key: z.string().min(1),
        value: z.any(),
        category: z.string().optional(),
      })
    ),
  }),
});

// 11. Achievements Schemas
export const achievementSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Judul prestasi/sertifikasi harus diisi"),
    issuer: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    date_received: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
    certificate_url: z.string().optional().nullable(),
    badge_url: z.string().optional().nullable(),
    sort_order: z.number().default(0),
  }),
});
