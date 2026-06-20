# 📋 Product Requirements Document (PRD)

## Portofolio Web Pribadi — "RianPedia"

> **Versi**: 1.0.0
> **Tanggal**: 20 Juni 2026
> **Status**: Draft
> **Author**: Rian (Owner)

---

## 📌 1. Ringkasan Eksekutif

### 1.1 Deskripsi Produk

Sebuah **web application portofolio pribadi** yang menampilkan profil, keahlian, proyek, pengalaman, dan prestasi secara interaktif dengan desain **futuristik Web3** yang dilengkapi animasi 3D. Dilengkapi halaman **admin panel** dengan fitur CRUD lengkap untuk seluruh konten.

### 1.2 Tujuan

| # | Tujuan | Deskripsi |
|---|--------|-----------|
| 1 | **Personal Branding** | Membangun identitas digital yang profesional dan memorable |
| 2 | **Showcase Portfolio** | Menampilkan proyek dan karya secara interaktif |
| 3 | **Self-Managed CMS** | Pemilik bisa mengelola seluruh konten tanpa developer |
| 4 | **Impresi Pertama** | Desain WOW dengan animasi 3D futuristik yang membedakan dari portofolio biasa |

### 1.3 Target Pengguna

- **Visitor (Public)**: Rekruter, klien potensial, rekan profesional
- **Admin (Owner)**: Pemilik portofolio yang mengelola konten

---

## 🛠️ 2. Tech Stack

### 2.1 Frontend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Next.js** | 15.x (App Router) | Framework React fullstack dengan SSR/SSG, Server Components, API Routes |
| **TypeScript** | 5.x | Type safety & developer experience |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **shadcn/ui** | Latest | Komponen UI aksesibel & customizable (Radix UI + Tailwind) |
| **Three.js** | Latest | Rendering 3D WebGL/WebGPU untuk animasi futuristik |
| **React Three Fiber** | Latest | React renderer untuk Three.js |
| **@react-three/drei** | Latest | Helper & abstraksi Three.js |
| **Framer Motion** | Latest | Animasi 2D transisi & micro-interactions |
| **next-themes** | Latest | Dark/Light mode switching |
| **React Hook Form** | Latest | Form management di admin panel |
| **Zod** | Latest | Schema validation |

### 2.2 Backend

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Express.js** | 5.x | REST API server untuk operasi CRUD admin |
| **Supabase** | Latest | Database (PostgreSQL), Auth, Storage (gambar/file) |
| **Supabase JS Client** | v2 | Client-side & server-side Supabase interactions |
| **JSON Web Token (JWT)** | Latest | Token-based authentication |
| **Multer** | Latest | Middleware upload file |
| **CORS** | Latest | Cross-Origin Resource Sharing |
| **Helmet** | Latest | Security headers |
| **Morgan** | Latest | HTTP request logging |

### 2.3 Development & Deployment

| Teknologi | Fungsi |
|-----------|--------|
| **ESLint + Prettier** | Code quality & formatting |
| **Supabase CLI** | Type generation & database migrations |
| **Vercel** | Deployment frontend (Next.js) |
| **Railway / Render** | Deployment backend (Express.js) |

### 2.4 Referensi Arsitektur (Context7)

- **Next.js App Router**: Menggunakan file-based routing di `/app` directory, `generateMetadata` untuk SEO dinamis, Server Components untuk performa optimal, dan Route Handlers (`route.ts`) untuk API internal
- **Supabase**: Menggunakan `createClient<Database>()` dengan TypeScript generated types via `supabase gen types typescript`, RLS (Row Level Security) untuk keamanan data, dan Storage untuk upload gambar
- **shadcn/ui**: Komponen di-copy ke project (`npx shadcn@latest add`), dark mode via `next-themes` dengan `ThemeProvider`, dan sidebar pattern untuk admin panel
- **Three.js**: WebGL/WebGPU renderer untuk efek 3D futuristik, particle systems, dan background interaktif

---

## 🎨 3. Desain & UI/UX

### 3.1 Design System — Tema "Crimson Silver"

#### Color Palette

```
/* ─── Light Mode ─── */
--background:          #F8F9FA      /* Silver White */
--foreground:          #1A1A2E      /* Dark Navy */
--primary:             #DC143C      /* Crimson Red */
--primary-hover:       #B91030      /* Dark Crimson */
--primary-foreground:  #FFFFFF      /* White */
--secondary:           #C0C0C0      /* Classic Silver */
--secondary-hover:     #A8A8A8      /* Dark Silver */
--accent:              #FF2D55      /* Neon Red */
--accent-glow:         rgba(220, 20, 60, 0.4)  /* Red Glow */
--muted:               #E8E8E8      /* Light Gray */
--card:                #FFFFFF      /* White */
--card-border:         rgba(192, 192, 192, 0.3) /* Silver Border */

/* ─── Dark Mode ─── */
--background:          #0A0A0F      /* Deep Black */
--foreground:          #E8E8E8      /* Light Silver */
--primary:             #FF1744      /* Bright Red */
--primary-hover:       #FF4569      /* Light Red */
--primary-foreground:  #FFFFFF      /* White */
--secondary:           #2A2A3E      /* Dark Silver */
--accent:              #FF2D55      /* Neon Red */
--accent-glow:         rgba(255, 23, 68, 0.6) /* Red Neon Glow */
--muted:               #1E1E2E      /* Muted Dark */
--card:                rgba(15, 15, 25, 0.8) /* Glassmorphism Card */
--card-border:         rgba(255, 23, 68, 0.2) /* Red Subtle Border */
--glass:               rgba(255, 255, 255, 0.05) /* Glass Effect */
```

#### Typography

```
--font-heading:   'Orbitron', sans-serif   /* Futuristik heading */
--font-body:      'Inter', sans-serif       /* Clean body text */
--font-mono:      'JetBrains Mono', monospace /* Code blocks */
```

### 3.2 Konsep Visual

| Aspek | Deskripsi |
|-------|-----------|
| **Estetika** | Futuristik Web3, cyberpunk, sci-fi dengan sentuhan elegan |
| **Glassmorphism** | Card dan panel dengan backdrop-blur, border semi-transparan |
| **3D Background** | Particle network, floating geometric shapes (octahedron, icosahedron) dengan wireframe merah-silver |
| **Animasi** | Smooth scroll, parallax, hover glow effects, text typing animation |
| **Interaktif** | Cursor trail effect, mouse-reactive 3D elements, scroll-triggered animations |
| **Responsive** | Mobile-first, breakpoints: sm(640px), md(768px), lg(1024px), xl(1280px), 2xl(1536px) |

### 3.3 Efek 3D (Three.js + React Three Fiber)

```
┌──────────────────────────────────────────────────────────┐
│ EFEK 3D YANG DIIMPLEMENTASIKAN                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ 1. Hero Section:                                         │
│    ├─ 3D Particle Network (nodes + garis koneksi)       │
│    ├─ Floating Geometric Shapes (auto-rotate)           │
│    └─ Mouse-follow camera movement                       │
│                                                          │
│ 2. About Section:                                        │
│    └─ 3D Avatar/Model rotation interaktif               │
│                                                          │
│ 3. Skills Section:                                       │
│    ├─ 3D Skill Sphere (tag cloud 3D)                    │
│    └─ Orbit animation untuk tech icons                   │
│                                                          │
│ 4. Projects Section:                                     │
│    ├─ 3D Card flip effect                                │
│    └─ Parallax depth on hover                            │
│                                                          │
│ 5. Background Global:                                    │
│    ├─ Animated grid lines (Tron-style)                  │
│    ├─ Floating particles dengan koneksi                  │
│    └─ Gradient mesh background animasi                   │
│                                                          │
│ 6. Transition Antar Section:                             │
│    └─ Scroll-triggered 3D morphing shapes               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 📐 4. Arsitektur Sistem

### 4.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        INTERNET / CDN                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
│   NEXT.JS APP   │ │  EXPRESS.JS  │ │    SUPABASE     │
│   (Frontend)    │ │  (Backend)   │ │   (BaaS)        │
│                 │ │              │ │                  │
│ • App Router    │ │ • REST API   │ │ • PostgreSQL DB  │
│ • SSR / SSG     │ │ • Auth       │ │ • Auth           │
│ • Server Comp.  │ │ • CRUD       │ │ • Storage        │
│ • API Routes    │ │ • Upload     │ │ • Row Level Sec. │
│ • Three.js 3D   │ │ • Validation │ │ • Realtime       │
│ • Tailwind CSS  │ │ • Middleware │ │ • Type Gen.      │
│ • shadcn/ui     │ │              │ │                  │
└────────┬────────┘ └──────┬───────┘ └────────┬─────────┘
         │                 │                  │
         │    REST API     │    Supabase JS   │
         │◄───────────────►│◄────────────────►│
         │                 │                  │
         │    Direct (SSR) │                  │
         │◄───────────────────────────────────►│
         │   (Server Components / API Routes) │
         │                                    │
```

### 4.2 Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                      DATA FLOW                                │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  PUBLIC (Visitor):                                            │
│  Browser ──► Next.js SSR/SSG ──► Supabase (direct read)     │
│                                                               │
│  ADMIN (CRUD Operations):                                     │
│  Browser ──► Next.js Client ──► Express.js API ──► Supabase  │
│                                                               │
│  AUTH Flow:                                                   │
│  Login Form ──► Express.js /auth/login ──► Supabase Auth     │
│  ──► JWT Token ──► Stored in httpOnly Cookie                 │
│                                                               │
│  FILE UPLOAD:                                                 │
│  Admin Upload ──► Express.js /upload ──► Supabase Storage    │
│  ──► Return public URL ──► Save to DB                        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 4.3 Folder Structure

```
portofolio-web/
├── apps/
│   ├── web/                          # Next.js Frontend (App Router)
│   │   ├── app/
│   │   │   ├── (public)/             # Public-facing pages (group route)
│   │   │   │   ├── page.tsx          # Landing / Home page
│   │   │   │   ├── about/
│   │   │   │   │   └── page.tsx      # About detail page
│   │   │   │   ├── projects/
│   │   │   │   │   ├── page.tsx      # Projects listing
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx  # Project detail
│   │   │   │   ├── experience/
│   │   │   │   │   └── page.tsx      # Experience & Achievements
│   │   │   │   └── contact/
│   │   │   │       └── page.tsx      # Contact page
│   │   │   │
│   │   │   ├── (admin)/              # Admin panel (protected group route)
│   │   │   │   ├── layout.tsx        # Admin layout + sidebar
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── page.tsx      # Admin dashboard overview
│   │   │   │   ├── manage-about/
│   │   │   │   │   └── page.tsx      # CRUD: About Me
│   │   │   │   ├── manage-skills/
│   │   │   │   │   └── page.tsx      # CRUD: Skills
│   │   │   │   ├── manage-projects/
│   │   │   │   │   ├── page.tsx      # CRUD: Projects list
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx  # Edit project
│   │   │   │   ├── manage-experience/
│   │   │   │   │   └── page.tsx      # CRUD: Experience & Achievements
│   │   │   │   ├── manage-hobbies/
│   │   │   │   │   └── page.tsx      # CRUD: Hobbies
│   │   │   │   ├── manage-contact/
│   │   │   │   │   └── page.tsx      # CRUD: Contact info & messages
│   │   │   │   ├── manage-photos/
│   │   │   │   │   └── page.tsx      # CRUD: Photo gallery
│   │   │   │   └── settings/
│   │   │   │       └── page.tsx      # Site settings, SEO, socials
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx      # Admin login page
│   │   │   │   └── callback/
│   │   │   │       └── route.ts      # Auth callback handler
│   │   │   │
│   │   │   ├── api/                  # Next.js API Routes (proxy/internal)
│   │   │   │   └── revalidate/
│   │   │   │       └── route.ts      # On-demand ISR revalidation
│   │   │   │
│   │   │   ├── layout.tsx            # Root layout (ThemeProvider, fonts)
│   │   │   ├── globals.css           # Global styles + Tailwind + CSS vars
│   │   │   ├── not-found.tsx         # Custom 404 page
│   │   │   └── error.tsx             # Error boundary
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── form.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── three/                # Three.js / R3F 3D components
│   │   │   │   ├── ParticleNetwork.tsx
│   │   │   │   ├── FloatingShapes.tsx
│   │   │   │   ├── SkillSphere.tsx
│   │   │   │   ├── HeroScene.tsx
│   │   │   │   ├── BackgroundScene.tsx
│   │   │   │   ├── AnimatedGrid.tsx
│   │   │   │   └── CursorTrail.tsx
│   │   │   │
│   │   │   ├── sections/             # Public page sections
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── AboutSection.tsx
│   │   │   │   ├── SkillsSection.tsx
│   │   │   │   ├── ProjectsSection.tsx
│   │   │   │   ├── ExperienceSection.tsx
│   │   │   │   ├── HobbiesSection.tsx
│   │   │   │   ├── ContactSection.tsx
│   │   │   │   ├── PhotoGallery.tsx
│   │   │   │   └── Footer.tsx
│   │   │   │
│   │   │   ├── admin/                # Admin panel components
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   ├── AdminHeader.tsx
│   │   │   │   ├── DataTable.tsx
│   │   │   │   ├── FormDialog.tsx
│   │   │   │   ├── ImageUploader.tsx
│   │   │   │   ├── RichTextEditor.tsx
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   └── DeleteConfirmDialog.tsx
│   │   │   │
│   │   │   ├── layout/               # Layout components
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── MobileNav.tsx
│   │   │   │   ├── ThemeToggle.tsx
│   │   │   │   └── ScrollProgress.tsx
│   │   │   │
│   │   │   └── shared/               # Shared/reusable components
│   │   │       ├── AnimatedText.tsx
│   │   │       ├── GlassCard.tsx
│   │   │       ├── SectionHeading.tsx
│   │   │       ├── LoadingSpinner.tsx
│   │   │       └── GlowButton.tsx
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useScrollAnimation.ts
│   │   │   ├── useMousePosition.ts
│   │   │   ├── useMediaQuery.ts
│   │   │   └── useSupabase.ts
│   │   │
│   │   ├── lib/                      # Utilities & configurations
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts         # Browser Supabase client
│   │   │   │   ├── server.ts         # Server Supabase client
│   │   │   │   └── admin.ts          # Admin Supabase client (service role)
│   │   │   ├── api.ts                # Express.js API client (axios/fetch)
│   │   │   ├── utils.ts              # Utility functions (cn, formatDate, etc.)
│   │   │   └── constants.ts          # App constants
│   │   │
│   │   ├── types/                    # TypeScript type definitions
│   │   │   ├── database.types.ts     # Supabase generated types
│   │   │   ├── api.types.ts          # API request/response types
│   │   │   └── index.ts              # Shared type exports
│   │   │
│   │   ├── public/                   # Static assets
│   │   │   ├── fonts/
│   │   │   ├── icons/
│   │   │   └── og-image.png
│   │   │
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── components.json           # shadcn/ui config
│   │   └── package.json
│   │
│   └── server/                       # Express.js Backend
│       ├── src/
│       │   ├── index.ts              # Entry point, Express app setup
│       │   ├── config/
│       │   │   ├── supabase.ts       # Supabase client init
│       │   │   ├── cors.ts           # CORS configuration
│       │   │   └── env.ts            # Environment variables validation
│       │   │
│       │   ├── middleware/
│       │   │   ├── auth.ts           # JWT authentication middleware
│       │   │   ├── validate.ts       # Request validation (Zod)
│       │   │   ├── errorHandler.ts   # Global error handler
│       │   │   ├── rateLimiter.ts    # Rate limiting
│       │   │   └── upload.ts         # Multer file upload config
│       │   │
│       │   ├── routes/
│       │   │   ├── index.ts          # Route aggregator
│       │   │   ├── auth.routes.ts    # /api/auth/*
│       │   │   ├── about.routes.ts   # /api/about/*
│       │   │   ├── skills.routes.ts  # /api/skills/*
│       │   │   ├── projects.routes.ts # /api/projects/*
│       │   │   ├── experience.routes.ts # /api/experience/*
│       │   │   ├── hobbies.routes.ts # /api/hobbies/*
│       │   │   ├── photos.routes.ts  # /api/photos/*
│       │   │   ├── contact.routes.ts # /api/contact/*
│       │   │   ├── settings.routes.ts # /api/settings/*
│       │   │   └── upload.routes.ts  # /api/upload/*
│       │   │
│       │   ├── controllers/
│       │   │   ├── auth.controller.ts
│       │   │   ├── about.controller.ts
│       │   │   ├── skills.controller.ts
│       │   │   ├── projects.controller.ts
│       │   │   ├── experience.controller.ts
│       │   │   ├── hobbies.controller.ts
│       │   │   ├── photos.controller.ts
│       │   │   ├── contact.controller.ts
│       │   │   ├── settings.controller.ts
│       │   │   └── upload.controller.ts
│       │   │
│       │   ├── services/
│       │   │   ├── auth.service.ts
│       │   │   ├── about.service.ts
│       │   │   ├── skills.service.ts
│       │   │   ├── projects.service.ts
│       │   │   ├── experience.service.ts
│       │   │   ├── hobbies.service.ts
│       │   │   ├── photos.service.ts
│       │   │   ├── contact.service.ts
│       │   │   ├── settings.service.ts
│       │   │   └── upload.service.ts
│       │   │
│       │   ├── validators/           # Zod schemas
│       │   │   ├── auth.schema.ts
│       │   │   ├── about.schema.ts
│       │   │   ├── skills.schema.ts
│       │   │   ├── projects.schema.ts
│       │   │   ├── experience.schema.ts
│       │   │   ├── hobbies.schema.ts
│       │   │   └── contact.schema.ts
│       │   │
│       │   └── types/
│       │       └── index.ts          # Backend type definitions
│       │
│       ├── tsconfig.json
│       └── package.json
│
├── supabase/                         # Supabase configuration
│   ├── migrations/                   # Database migrations
│   │   ├── 001_create_profiles.sql
│   │   ├── 002_create_about.sql
│   │   ├── 003_create_skills.sql
│   │   ├── 004_create_projects.sql
│   │   ├── 005_create_experience.sql
│   │   ├── 006_create_hobbies.sql
│   │   ├── 007_create_photos.sql
│   │   ├── 008_create_contact.sql
│   │   ├── 009_create_settings.sql
│   │   └── 010_create_rls_policies.sql
│   ├── seed.sql                      # Seed data
│   └── config.toml                   # Supabase local config
│
├── prd.md                            # Dokumen ini
├── .env.example                      # Template environment variables
├── .gitignore
├── package.json                      # Root package.json (workspace)
├── turbo.json                        # Turborepo configuration (optional)
└── README.md
```

---

## 🗄️ 5. Database Schema (Supabase PostgreSQL)

### 5.1 Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   profiles   │     │    about     │     │     skills       │
├──────────────┤     ├──────────────┤     ├──────────────────┤
│ id (PK,UUID) │     │ id (PK,UUID) │     │ id (PK,UUID)     │
│ email        │     │ title        │     │ name             │
│ full_name    │     │ subtitle     │     │ category         │
│ avatar_url   │     │ bio_short    │     │ icon_url         │
│ role         │     │ bio_full     │     │ proficiency (%)  │
│ created_at   │     │ photo_url    │     │ is_featured      │
│ updated_at   │     │ resume_url   │     │ sort_order       │
└──────────────┘     │ location     │     │ color            │
                     │ birthdate    │     │ created_at       │
                     │ tagline      │     │ updated_at       │
                     │ created_at   │     └──────────────────┘
                     │ updated_at   │
                     └──────────────┘

┌──────────────────┐     ┌────────────────────┐
│    projects      │     │  project_images    │
├──────────────────┤     ├────────────────────┤
│ id (PK,UUID)     │     │ id (PK,UUID)       │
│ title            │     │ project_id (FK)    │
│ slug             │     │ image_url          │
│ description      │     │ caption            │
│ long_description │     │ sort_order         │
│ thumbnail_url    │     │ created_at         │
│ live_url         │     └────────────────────┘
│ github_url       │
│ tech_stack[]     │     ┌────────────────────┐
│ category         │     │  project_tags      │
│ status           │     ├────────────────────┤
│ is_featured      │     │ id (PK,UUID)       │
│ start_date       │     │ project_id (FK)    │
│ end_date         │     │ tag_name           │
│ sort_order       │     └────────────────────┘
│ created_at       │
│ updated_at       │
└──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│   experience     │     │  achievements    │
├──────────────────┤     ├──────────────────┤
│ id (PK,UUID)     │     │ id (PK,UUID)     │
│ type (enum)      │     │ title            │
│ title            │     │ issuer           │
│ company/org      │     │ description      │
│ location         │     │ date_received    │
│ description      │     │ certificate_url  │
│ start_date       │     │ badge_url        │
│ end_date         │     │ sort_order       │
│ is_current       │     │ created_at       │
│ logo_url         │     │ updated_at       │
│ sort_order       │     └──────────────────┘
│ created_at       │
│ updated_at       │
└──────────────────┘

┌──────────────────┐     ┌──────────────────┐
│    hobbies       │     │     photos       │
├──────────────────┤     ├──────────────────┤
│ id (PK,UUID)     │     │ id (PK,UUID)     │
│ name             │     │ title            │
│ description      │     │ url              │
│ icon_name        │     │ caption          │
│ image_url        │     │ category         │
│ sort_order       │     │ is_profile       │
│ created_at       │     │ sort_order       │
│ updated_at       │     │ width            │
└──────────────────┘     │ height           │
                         │ created_at       │
                         │ updated_at       │
                         └──────────────────┘

┌────────────────────┐     ┌──────────────────┐
│ contact_messages   │     │  social_links    │
├────────────────────┤     ├──────────────────┤
│ id (PK,UUID)       │     │ id (PK,UUID)     │
│ name               │     │ platform         │
│ email              │     │ url              │
│ subject            │     │ icon_name        │
│ message            │     │ sort_order       │
│ is_read            │     │ is_visible       │
│ is_starred         │     │ created_at       │
│ replied_at         │     │ updated_at       │
│ created_at         │     └──────────────────┘
└────────────────────┘

┌──────────────────┐     ┌──────────────────────┐
│ site_settings    │     │   education          │
├──────────────────┤     ├──────────────────────┤
│ id (PK,UUID)     │     │ id (PK,UUID)         │
│ key (unique)     │     │ institution          │
│ value (jsonb)    │     │ degree               │
│ category         │     │ field_of_study       │
│ updated_at       │     │ start_date           │
└──────────────────┘     │ end_date             │
                         │ is_current           │
                         │ description          │
                         │ logo_url             │
                         │ grade                │
                         │ sort_order           │
                         │ created_at           │
                         │ updated_at           │
                         └──────────────────────┘
```

### 5.2 Tabel Detail

#### `profiles`

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | `UUID` | PK, default `gen_random_uuid()` | Primary key |
| `email` | `TEXT` | UNIQUE, NOT NULL | Email admin |
| `full_name` | `TEXT` | NOT NULL | Nama lengkap |
| `avatar_url` | `TEXT` | | URL foto profil |
| `role` | `TEXT` | DEFAULT 'admin' | Role pengguna |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Waktu dibuat |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Waktu diupdate |

#### `about`

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | `UUID` | PK | Primary key |
| `title` | `TEXT` | NOT NULL | Judul section (e.g., "Full Stack Developer") |
| `subtitle` | `TEXT` | | Sub-judul / tagline |
| `bio_short` | `TEXT` | | Bio singkat (untuk hero section) |
| `bio_full` | `TEXT` | | Bio lengkap (rich text / markdown) |
| `photo_url` | `TEXT` | | Foto utama |
| `resume_url` | `TEXT` | | Link download CV/Resume |
| `location` | `TEXT` | | Lokasi (kota, negara) |
| `birthdate` | `DATE` | | Tanggal lahir |
| `tagline` | `TEXT` | | Tagline satu kalimat |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Waktu dibuat |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | Waktu diupdate |

#### `skills`

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | `UUID` | PK | Primary key |
| `name` | `TEXT` | NOT NULL | Nama skill (e.g., "React.js") |
| `category` | `TEXT` | NOT NULL | Kategori: "frontend", "backend", "mobile", "devops", "tools", "soft_skills" |
| `icon_url` | `TEXT` | | URL icon/logo skill |
| `proficiency` | `INTEGER` | CHECK (0-100) | Level kemahiran dalam persen |
| `is_featured` | `BOOLEAN` | DEFAULT false | Tampilkan di featured section |
| `sort_order` | `INTEGER` | DEFAULT 0 | Urutan tampilan |
| `color` | `TEXT` | | Warna aksen skill (hex code) |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |

#### `projects`

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | `UUID` | PK | Primary key |
| `title` | `TEXT` | NOT NULL | Judul proyek |
| `slug` | `TEXT` | UNIQUE, NOT NULL | URL-friendly slug |
| `description` | `TEXT` | NOT NULL | Deskripsi singkat |
| `long_description` | `TEXT` | | Deskripsi detail (rich text) |
| `thumbnail_url` | `TEXT` | | Gambar thumbnail |
| `live_url` | `TEXT` | | Link live demo |
| `github_url` | `TEXT` | | Link GitHub repository |
| `tech_stack` | `TEXT[]` | | Array teknologi yang digunakan |
| `category` | `TEXT` | | Kategori: "web", "mobile", "desktop", "api", "other" |
| `status` | `TEXT` | DEFAULT 'completed' | Status: "in_progress", "completed", "archived" |
| `is_featured` | `BOOLEAN` | DEFAULT false | Tampilkan di beranda |
| `start_date` | `DATE` | | Tanggal mulai |
| `end_date` | `DATE` | | Tanggal selesai |
| `sort_order` | `INTEGER` | DEFAULT 0 | Urutan tampilan |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |

#### `experience`

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | `UUID` | PK | Primary key |
| `type` | `TEXT` | NOT NULL | Tipe: "work", "freelance", "volunteer", "internship" |
| `title` | `TEXT` | NOT NULL | Posisi / Jabatan |
| `company` | `TEXT` | NOT NULL | Nama perusahaan / organisasi |
| `location` | `TEXT` | | Lokasi kerja |
| `description` | `TEXT` | | Deskripsi pekerjaan (rich text) |
| `start_date` | `DATE` | NOT NULL | Tanggal mulai |
| `end_date` | `DATE` | | Tanggal selesai (null = sekarang) |
| `is_current` | `BOOLEAN` | DEFAULT false | Masih bekerja di sini |
| `logo_url` | `TEXT` | | Logo perusahaan |
| `sort_order` | `INTEGER` | DEFAULT 0 | |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |

#### `achievements`

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | `UUID` | PK | Primary key |
| `title` | `TEXT` | NOT NULL | Judul prestasi / sertifikasi |
| `issuer` | `TEXT` | | Penerbit (organisasi, platform) |
| `description` | `TEXT` | | Deskripsi detail |
| `date_received` | `DATE` | | Tanggal diterima |
| `certificate_url` | `TEXT` | | Link sertifikat |
| `badge_url` | `TEXT` | | Gambar badge / logo |
| `sort_order` | `INTEGER` | DEFAULT 0 | |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |

#### `hobbies`

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | `UUID` | PK | Primary key |
| `name` | `TEXT` | NOT NULL | Nama hobi |
| `description` | `TEXT` | | Deskripsi singkat |
| `icon_name` | `TEXT` | | Nama icon (Lucide icon name) |
| `image_url` | `TEXT` | | Gambar representasi hobi |
| `sort_order` | `INTEGER` | DEFAULT 0 | |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |

#### `photos`

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | `UUID` | PK | Primary key |
| `title` | `TEXT` | | Judul foto |
| `url` | `TEXT` | NOT NULL | URL gambar (Supabase Storage) |
| `caption` | `TEXT` | | Keterangan foto |
| `category` | `TEXT` | | Kategori: "profile", "project", "event", "casual" |
| `is_profile` | `BOOLEAN` | DEFAULT false | Digunakan sebagai foto profil |
| `sort_order` | `INTEGER` | DEFAULT 0 | |
| `width` | `INTEGER` | | Lebar pixel |
| `height` | `INTEGER` | | Tinggi pixel |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |

#### `contact_messages`

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | `UUID` | PK | Primary key |
| `name` | `TEXT` | NOT NULL | Nama pengirim |
| `email` | `TEXT` | NOT NULL | Email pengirim |
| `subject` | `TEXT` | | Subjek pesan |
| `message` | `TEXT` | NOT NULL | Isi pesan |
| `is_read` | `BOOLEAN` | DEFAULT false | Sudah dibaca |
| `is_starred` | `BOOLEAN` | DEFAULT false | Ditandai penting |
| `replied_at` | `TIMESTAMPTZ` | | Waktu dibalas |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |

#### `social_links`

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | `UUID` | PK | Primary key |
| `platform` | `TEXT` | NOT NULL | Nama platform (GitHub, LinkedIn, dll.) |
| `url` | `TEXT` | NOT NULL | URL profil |
| `icon_name` | `TEXT` | | Nama icon |
| `sort_order` | `INTEGER` | DEFAULT 0 | |
| `is_visible` | `BOOLEAN` | DEFAULT true | Tampilkan di website |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |

#### `education`

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | `UUID` | PK | Primary key |
| `institution` | `TEXT` | NOT NULL | Nama institusi |
| `degree` | `TEXT` | | Gelar (S1, D3, dll.) |
| `field_of_study` | `TEXT` | | Jurusan / bidang studi |
| `start_date` | `DATE` | | Tanggal mulai |
| `end_date` | `DATE` | | Tanggal lulus |
| `is_current` | `BOOLEAN` | DEFAULT false | Masih kuliah |
| `description` | `TEXT` | | Deskripsi / kegiatan |
| `logo_url` | `TEXT` | | Logo institusi |
| `grade` | `TEXT` | | IPK / nilai |
| `sort_order` | `INTEGER` | DEFAULT 0 | |
| `created_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |

#### `site_settings`

| Kolom | Tipe | Constraint | Deskripsi |
|-------|------|------------|-----------|
| `id` | `UUID` | PK | Primary key |
| `key` | `TEXT` | UNIQUE, NOT NULL | Key setting (e.g., "site_title", "meta_description") |
| `value` | `JSONB` | | Value setting (flexible JSON) |
| `category` | `TEXT` | | Kategori: "seo", "general", "social", "appearance" |
| `updated_at` | `TIMESTAMPTZ` | DEFAULT `now()` | |

### 5.3 Row Level Security (RLS) Policies

```sql
-- Semua tabel: Public READ (visitor bisa melihat)
CREATE POLICY "Public read access" ON public.<table>
  FOR SELECT USING (true);

-- Semua tabel konten: Hanya authenticated admin yang bisa INSERT/UPDATE/DELETE
CREATE POLICY "Admin full access" ON public.<table>
  FOR ALL USING (
    auth.role() = 'authenticated'
    AND auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- contact_messages: Public bisa INSERT (kirim pesan)
CREATE POLICY "Public can send messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- contact_messages: Hanya admin yang bisa READ/UPDATE/DELETE
CREATE POLICY "Admin manage messages" ON public.contact_messages
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );
```

### 5.4 Supabase Storage Buckets

| Bucket | Akses | Deskripsi |
|--------|-------|-----------|
| `avatars` | Public read, Auth write | Foto profil |
| `projects` | Public read, Auth write | Screenshot & gambar proyek |
| `photos` | Public read, Auth write | Galeri foto umum |
| `documents` | Public read, Auth write | CV, sertifikat, dokumen |
| `logos` | Public read, Auth write | Logo perusahaan, skill icons |

---

## 🔌 6. API Specification (Express.js Backend)

### 6.1 Base Configuration

```
Base URL:     https://api.rianpedia.com  (production)
              http://localhost:4000/api   (development)
Content-Type: application/json
Auth Header:  Authorization: Bearer <JWT_TOKEN>
```

### 6.2 Endpoints Overview

#### 🔐 Authentication

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/api/auth/login` | ❌ | Login admin (email + password) |
| `POST` | `/api/auth/logout` | ✅ | Logout (invalidate token) |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |
| `PUT` | `/api/auth/profile` | ✅ | Update admin profile |
| `POST` | `/api/auth/change-password` | ✅ | Ganti password |
| `POST` | `/api/auth/refresh` | ✅ | Refresh JWT token |

#### 👤 About Me

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/about` | ❌ | Get about info (public) |
| `PUT` | `/api/about` | ✅ | Update about info |

#### 🛠️ Skills

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/skills` | ❌ | Get all skills (public) |
| `GET` | `/api/skills/:id` | ❌ | Get skill by ID |
| `POST` | `/api/skills` | ✅ | Create new skill |
| `PUT` | `/api/skills/:id` | ✅ | Update skill |
| `DELETE` | `/api/skills/:id` | ✅ | Delete skill |
| `PUT` | `/api/skills/reorder` | ✅ | Reorder skills (drag & drop) |

#### 📁 Projects

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/projects` | ❌ | Get all projects (public, with filters) |
| `GET` | `/api/projects/:slug` | ❌ | Get project by slug |
| `POST` | `/api/projects` | ✅ | Create new project |
| `PUT` | `/api/projects/:id` | ✅ | Update project |
| `DELETE` | `/api/projects/:id` | ✅ | Delete project |
| `POST` | `/api/projects/:id/images` | ✅ | Add project images |
| `DELETE` | `/api/projects/:id/images/:imgId` | ✅ | Delete project image |

#### 💼 Experience

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/experience` | ❌ | Get all experience (public) |
| `GET` | `/api/experience/:id` | ❌ | Get by ID |
| `POST` | `/api/experience` | ✅ | Create experience |
| `PUT` | `/api/experience/:id` | ✅ | Update experience |
| `DELETE` | `/api/experience/:id` | ✅ | Delete experience |

#### 🏆 Achievements

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/achievements` | ❌ | Get all achievements (public) |
| `POST` | `/api/achievements` | ✅ | Create achievement |
| `PUT` | `/api/achievements/:id` | ✅ | Update achievement |
| `DELETE` | `/api/achievements/:id` | ✅ | Delete achievement |

#### 🎓 Education

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/education` | ❌ | Get all education (public) |
| `POST` | `/api/education` | ✅ | Create education |
| `PUT` | `/api/education/:id` | ✅ | Update education |
| `DELETE` | `/api/education/:id` | ✅ | Delete education |

#### 🎮 Hobbies

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/hobbies` | ❌ | Get all hobbies (public) |
| `POST` | `/api/hobbies` | ✅ | Create hobby |
| `PUT` | `/api/hobbies/:id` | ✅ | Update hobby |
| `DELETE` | `/api/hobbies/:id` | ✅ | Delete hobby |

#### 📸 Photos

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/photos` | ❌ | Get all photos (public, with category filter) |
| `POST` | `/api/photos` | ✅ | Upload & create photo |
| `PUT` | `/api/photos/:id` | ✅ | Update photo metadata |
| `DELETE` | `/api/photos/:id` | ✅ | Delete photo (+ storage cleanup) |

#### 📬 Contact / Messages

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/api/contact/send` | ❌ | Send contact message (public + rate limited) |
| `GET` | `/api/contact/messages` | ✅ | Get all messages (admin) |
| `PUT` | `/api/contact/messages/:id/read` | ✅ | Mark as read |
| `PUT` | `/api/contact/messages/:id/star` | ✅ | Toggle star |
| `DELETE` | `/api/contact/messages/:id` | ✅ | Delete message |

#### 🔗 Social Links

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/social-links` | ❌ | Get all social links (public) |
| `POST` | `/api/social-links` | ✅ | Create social link |
| `PUT` | `/api/social-links/:id` | ✅ | Update social link |
| `DELETE` | `/api/social-links/:id` | ✅ | Delete social link |

#### ⚙️ Site Settings

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/settings` | ❌ | Get public settings |
| `GET` | `/api/settings/:key` | ❌ | Get specific setting |
| `PUT` | `/api/settings/:key` | ✅ | Update setting |
| `PUT` | `/api/settings/bulk` | ✅ | Bulk update settings |

#### 📤 File Upload

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `POST` | `/api/upload/image` | ✅ | Upload single image |
| `POST` | `/api/upload/images` | ✅ | Upload multiple images |
| `POST` | `/api/upload/document` | ✅ | Upload document (PDF, etc.) |
| `DELETE` | `/api/upload/:bucket/:path` | ✅ | Delete file from storage |

### 6.3 API Response Format

#### Success Response

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### 6.4 Request Contoh: Create Project

```http
POST /api/projects
Authorization: Bearer eyJhbGciOi...
Content-Type: application/json

{
  "title": "E-Commerce Dashboard",
  "slug": "e-commerce-dashboard",
  "description": "Full-stack e-commerce admin dashboard",
  "long_description": "## Overview\nA comprehensive dashboard...",
  "thumbnail_url": "https://xyz.supabase.co/storage/v1/object/public/projects/thumb.webp",
  "live_url": "https://demo.example.com",
  "github_url": "https://github.com/user/project",
  "tech_stack": ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
  "category": "web",
  "status": "completed",
  "is_featured": true,
  "start_date": "2025-01-15",
  "end_date": "2025-06-20"
}
```

---

## 🖥️ 7. Halaman & Fitur Frontend

### 7.1 Public Pages (Visitor)

#### 7.1.1 Home / Landing Page (`/`)

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌───────────────────────────────────────────────────────────┐   │
│ │                     NAVBAR                                │   │
│ │  Logo   |  About  Skills  Projects  Experience  Contact  │   │
│ │                                          🌙/☀️  [Hire Me] │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │                  ★ HERO SECTION ★                        │   │
│ │                                                           │   │
│ │  [3D Particle Network Background - Three.js]              │   │
│ │                                                           │   │
│ │          👋 Hi, I'm [Nama]                                │   │
│ │          [Animated Typing: "Full Stack Developer |        │   │
│ │           UI/UX Designer | Problem Solver"]               │   │
│ │                                                           │   │
│ │          [Bio singkat 2-3 kalimat]                        │   │
│ │                                                           │   │
│ │          [🔴 View Projects]  [⚪ Download CV]             │   │
│ │                                                           │   │
│ │  [Floating 3D Geometric Shapes - Octahedron, Torus]      │   │
│ │  [Scroll Down Indicator ↓]                                │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │                  ABOUT PREVIEW                            │   │
│ │                                                           │   │
│ │  [3D Photo Frame]   Tentang Saya                         │   │
│ │  [Interactive         Bio singkat...                      │   │
│ │   rotation]           Lokasi | Umur | Status             │   │
│ │                       [Read More →]                       │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │                  SKILLS SECTION                           │   │
│ │                                                           │   │
│ │  [3D Skill Sphere/Globe - interaktif putar]              │   │
│ │                                                           │   │
│ │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │   │
│ │  │ Frontend │ │ Backend  │ │ Mobile   │ │ DevOps   │    │   │
│ │  │ ● React  │ │ ● Node   │ │ ● React  │ │ ● Docker │    │   │
│ │  │ ● Next   │ │ ● Express│ │   Native │ │ ● CI/CD  │    │   │
│ │  │ ● TS     │ │ ● Python │ │ ● Flutter│ │ ● AWS    │    │   │
│ │  │ [90%]    │ │ [85%]    │ │ [75%]    │ │ [70%]    │    │   │
│ │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │                  FEATURED PROJECTS                        │   │
│ │                                                           │   │
│ │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │   │
│ │  │ [3D Hover   │ │ [3D Hover   │ │ [3D Hover   │        │   │
│ │  │  Card]      │ │  Card]      │ │  Card]      │        │   │
│ │  │ 🖼️ Thumb    │ │ 🖼️ Thumb    │ │ 🖼️ Thumb    │        │   │
│ │  │ Title       │ │ Title       │ │ Title       │        │   │
│ │  │ Tech tags   │ │ Tech tags   │ │ Tech tags   │        │   │
│ │  │ [Live][Code]│ │ [Live][Code]│ │ [Live][Code]│        │   │
│ │  └─────────────┘ └─────────────┘ └─────────────┘        │   │
│ │                                                           │   │
│ │              [View All Projects →]                        │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │                  EXPERIENCE TIMELINE                      │   │
│ │                                                           │   │
│ │     ●───── 2026: Senior Dev @ Company A                  │   │
│ │     │      Deskripsi singkat...                           │   │
│ │     ●───── 2025: Full Stack @ Company B                  │   │
│ │     │      Deskripsi singkat...                           │   │
│ │     ●───── 2024: Junior Dev @ Company C                  │   │
│ │     │      Deskripsi singkat...                           │   │
│ │     ●      [Animated timeline with scroll trigger]       │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │                  ACHIEVEMENTS                             │   │
│ │                                                           │   │
│ │  🏆 [Badge Card]  🏆 [Badge Card]  🏆 [Badge Card]      │   │
│ │  Sertifikat A      Sertifikat B     Penghargaan C        │   │
│ │  [Hover: glow]    [Hover: glow]    [Hover: glow]        │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │                  HOBBIES & INTERESTS                      │   │
│ │                                                           │   │
│ │  🎮 Gaming    📷 Photography    🎸 Music    ✈️ Travel    │   │
│ │  [Animated icons with hover descriptions]                │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │                  PHOTO GALLERY                            │   │
│ │                                                           │   │
│ │  [Masonry Grid Layout with Lightbox]                     │   │
│ │  ┌────┐ ┌────────┐ ┌────┐                                │   │
│ │  │    │ │        │ │    │                                 │   │
│ │  │    │ │        │ ├────┤                                 │   │
│ │  ├────┤ └────────┘ │    │                                 │   │
│ │  │    │ ┌────┐     │    │                                 │   │
│ │  └────┘ └────┘     └────┘                                │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │                  CONTACT SECTION                          │   │
│ │                                                           │   │
│ │  📍 Location      📧 Email        📱 Phone              │   │
│ │                                                           │   │
│ │  ┌─────────────────────────────────┐  ┌────────────────┐ │   │
│ │  │ Contact Form                    │  │ Social Links   │ │   │
│ │  │ [Name       ]                   │  │ GitHub     →   │ │   │
│ │  │ [Email      ]                   │  │ LinkedIn   →   │ │   │
│ │  │ [Subject    ]                   │  │ Twitter    →   │ │   │
│ │  │ [Message    ]                   │  │ Instagram  →   │ │   │
│ │  │ [🔴 Send Message]              │  │ YouTube    →   │ │   │
│ │  └─────────────────────────────────┘  └────────────────┘ │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │                      FOOTER                               │   │
│ │  © 2026 [Nama]. All rights reserved.                     │   │
│ │  [Social Icons]  |  [Back to Top ↑]                      │   │
│ └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Fitur Interaktif:**
- Smooth scroll navigation dengan active section highlighting
- Scroll progress bar di atas navbar
- Parallax effects pada setiap section
- Lazy loading gambar dengan skeleton placeholder
- SEO metadata dinamis via `generateMetadata`

#### 7.1.2 Project Detail Page (`/projects/[slug]`)

- Hero banner dengan gambar thumbnail besar
- Info proyek (tech stack badges, tanggal, status)
- Deskripsi detail (rendered markdown)
- Gallery gambar dengan lightbox
- Link Live Demo & GitHub
- Navigasi ke project sebelum/sesudah
- Related projects

#### 7.1.3 Custom 404 Page

- Animasi 3D glitch effect
- Pesan error yang kreatif
- Tombol kembali ke home

### 7.2 Admin Panel (`/admin/*`)

#### 7.2.1 Login Page (`/auth/login`)

- Form login dengan email & password
- Animasi background 3D subtle
- Branding RianPedia
- Error handling & loading states

#### 7.2.2 Dashboard (`/admin/dashboard`)

```
┌─────────────────────────────────────────────────────────────────┐
│ ┌────────────┐ ┌─────────────────────────────────────────────┐ │
│ │  SIDEBAR   │ │  MAIN CONTENT                               │ │
│ │            │ │                                              │ │
│ │ 🏠 Dashboard│ │  📊 Dashboard Overview                     │ │
│ │ 👤 About   │ │                                              │ │
│ │ 🛠️ Skills  │ │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐      │ │
│ │ 📁 Projects│ │  │ 12   │ │ 8    │ │ 5    │ │ 24   │      │ │
│ │ 💼 Exp.    │ │  │Skills│ │Proj. │ │Exp.  │ │Msgs  │      │ │
│ │ 🏆 Achieve.│ │  └──────┘ └──────┘ └──────┘ └──────┘      │ │
│ │ 🎓 Edu.    │ │                                              │ │
│ │ 🎮 Hobbies │ │  📬 Recent Messages                         │ │
│ │ 📸 Photos  │ │  ┌──────────────────────────────────────┐   │ │
│ │ 📬 Messages│ │  │ John - "Hello, interested in..."    │   │ │
│ │ 🔗 Socials │ │  │ Jane - "Great portfolio! Can we..." │   │ │
│ │ ⚙️ Settings│ │  └──────────────────────────────────────┘   │ │
│ │            │ │                                              │ │
│ │ 🚪 Logout  │ │  📈 Site Analytics (optional)               │ │
│ └────────────┘ └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

#### 7.2.3 CRUD Pages Pattern (Semua manage-* pages)

Setiap halaman manajemen konten mengikuti pattern yang konsisten:

```
┌─────────────────────────────────────────────────────────────┐
│ Header: [Section Title]              [+ Add New] Button    │
├─────────────────────────────────────────────────────────────┤
│ Filter/Search Bar                                           │
├─────────────────────────────────────────────────────────────┤
│ DataTable (shadcn/ui Table)                                │
│ ┌────┬───────────┬──────────┬────────┬─────────┬─────────┐│
│ │ #  │ Name      │ Category │ Status │ Date    │ Actions ││
│ ├────┼───────────┼──────────┼────────┼─────────┼─────────┤│
│ │ 1  │ React.js  │ Frontend │ ✅     │ Jun 20  │ ✏️ 🗑️  ││
│ │ 2  │ Node.js   │ Backend  │ ✅     │ Jun 19  │ ✏️ 🗑️  ││
│ │ 3  │ Docker    │ DevOps   │ ✅     │ Jun 18  │ ✏️ 🗑️  ││
│ └────┴───────────┴──────────┴────────┴─────────┴─────────┘│
│ Pagination: [< 1 2 3 ... 10 >]                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Dialog/Modal] - Create/Edit Form                          │
│ ┌─────────────────────────────────────────────┐            │
│ │ ✕ Create New Skill                          │            │
│ │                                             │            │
│ │ Name:        [____________]                 │            │
│ │ Category:    [▼ Select... ]                 │            │
│ │ Proficiency: [====●=======] 75%            │            │
│ │ Icon:        [📤 Upload]                    │            │
│ │ Featured:    [Toggle ●   ]                  │            │
│ │                                             │            │
│ │         [Cancel]  [🔴 Save]                 │            │
│ └─────────────────────────────────────────────┘            │
│                                                             │
│ [Delete Confirmation Dialog]                                │
│ ┌─────────────────────────────────────────────┐            │
│ │ ⚠️ Are you sure?                            │            │
│ │ This action cannot be undone.               │            │
│ │         [Cancel]  [🔴 Delete]               │            │
│ └─────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

**Komponen shadcn/ui yang digunakan:**
- `DataTable` (with sorting, filtering, pagination)
- `Dialog` (modal create/edit)
- `AlertDialog` (delete confirmation)
- `Form` (React Hook Form + Zod)
- `Input`, `Textarea`, `Select`, `Switch`, `Slider`
- `Toast` (notifikasi sukses/error)
- `Badge` (status indicators)
- `Skeleton` (loading state)
- `DropdownMenu` (row actions)

---

## 🔒 8. Autentikasi & Keamanan

### 8.1 Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                     AUTH FLOW                                 │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. ADMIN LOGIN                                               │
│     ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│     │ Login    │───►│ Express  │───►│ Supabase │            │
│     │ Form     │    │ /auth/   │    │ Auth     │            │
│     │ (Next.js)│    │ login    │    │ signIn() │            │
│     └──────────┘    └────┬─────┘    └──────────┘            │
│                          │                                    │
│  2. TOKEN ISSUANCE       │                                    │
│     ┌──────────┐    ┌────▼─────┐                             │
│     │ JWT      │◄───│ Generate │                             │
│     │ Token    │    │ JWT +    │                             │
│     │ (Cookie) │    │ Refresh  │                             │
│     └──────────┘    └──────────┘                             │
│                                                               │
│  3. PROTECTED REQUESTS                                        │
│     ┌──────────┐    ┌──────────┐    ┌──────────┐            │
│     │ Admin    │───►│ Express  │───►│ Verify   │            │
│     │ Action   │    │ API      │    │ JWT      │            │
│     │ (CRUD)   │    │ Endpoint │    │ Token    │            │
│     └──────────┘    └──────────┘    └────┬─────┘            │
│                                          │ ✅                │
│                                     ┌────▼─────┐            │
│                                     │ Supabase │            │
│                                     │ Service  │            │
│                                     │ Role     │            │
│                                     └──────────┘            │
│                                                               │
│  4. MIDDLEWARE PROTECTION (Next.js)                           │
│     /admin/* routes ──► middleware.ts ──► Check cookie        │
│     ──► Redirect to /auth/login if no valid token            │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 8.2 Security Measures

| Layer | Implementasi |
|-------|-------------|
| **CORS** | Whitelist origin frontend only |
| **Helmet** | Security headers (CSP, XSS, etc.) |
| **Rate Limiting** | Max 100 req/15min per IP (API), max 5 req/15min (contact form) |
| **JWT** | Access token (15min) + Refresh token (7 days), httpOnly cookie |
| **Input Validation** | Zod schema pada semua endpoint |
| **RLS** | Row Level Security di Supabase |
| **File Upload** | Max 5MB, hanya gambar (JPEG, PNG, WebP, SVG), sanitize filename |
| **SQL Injection** | Prevented by Supabase client (parameterized queries) |
| **XSS** | React auto-escaping + sanitize user input |

---

## 🌙 9. Dark & Light Mode

### 9.1 Implementasi

```tsx
// Menggunakan next-themes + shadcn/ui ThemeProvider
// Ref: Context7 - shadcn/ui Dark Mode Setup

import { ThemeProvider } from "next-themes"

<ThemeProvider 
  attribute="class" 
  defaultTheme="dark"       // Default dark (futuristik)
  enableSystem 
  disableTransitionOnChange={false}  // Smooth transition
>
  {children}
</ThemeProvider>
```

### 9.2 Theme Toggle Component

- Toggle button di navbar (🌙 ↔ ☀️)
- Animasi transisi smooth
- Persist pilihan di localStorage
- System preference detection
- CSS variables berubah otomatis sesuai class `.dark`

### 9.3 Perbedaan Visual

| Aspek | Light Mode | Dark Mode |
|-------|-----------|-----------|
| Background | Silver White `#F8F9FA` | Deep Black `#0A0A0F` |
| Cards | Solid White + shadow | Glassmorphism + red glow border |
| Primary | Crimson `#DC143C` | Bright Red `#FF1744` |
| 3D Effects | Subtle, silver wireframes | Intense neon red, glowing particles |
| Text | Dark Navy `#1A1A2E` | Light Silver `#E8E8E8` |

---

## 📱 10. Responsive Design (Detail Lengkap)

### 10.1 Breakpoints & Target Devices

| Breakpoint | Ukuran | Target Device | Container Max | Padding |
|-----------|--------|---------------|---------------|---------|
| `xs` | < 640px | Small phones (iPhone SE, Galaxy S) | 100% | 16px |
| `sm` | ≥ 640px | Large phones landscape | 640px | 16px |
| `md` | ≥ 768px | Tablets (iPad Mini, Galaxy Tab) | 768px | 24px |
| `lg` | ≥ 1024px | Laptops, iPad Pro landscape | 1024px | 32px |
| `xl` | ≥ 1280px | Desktop monitors | 1280px | 32px |
| `2xl` | ≥ 1536px | Large/Ultra-wide monitors | 1440px | 40px |

### 10.2 Pendekatan Responsive

```
┌──────────────────────────────────────────────────────────────┐
│                   STRATEGI RESPONSIVE                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  1. MOBILE-FIRST APPROACH                                     │
│     • CSS ditulis untuk mobile terlebih dahulu               │
│     • Breakpoint digunakan untuk scale UP ke tablet/desktop  │
│     • Tailwind CSS default = mobile                           │
│                                                               │
│  2. FLUID TYPOGRAPHY                                          │
│     • Font size menggunakan clamp() untuk smooth scaling      │
│     • Contoh: clamp(1rem, 2.5vw, 1.5rem)                    │
│                                                               │
│  3. FLUID SPACING                                             │
│     • Gap, padding, margin menggunakan responsive values     │
│     • Contoh: gap-4 md:gap-6 lg:gap-8                        │
│                                                               │
│  4. CONTAINER QUERIES (where applicable)                     │
│     • Komponen admin card menggunakan container queries      │
│     • Memungkinkan komponen adaptif tanpa breakpoint global   │
│                                                               │
│  5. PROGRESSIVE ENHANCEMENT                                  │
│     • Fitur 3D di-load bertahap berdasarkan device capability│
│     • Touch events untuk mobile, hover effects untuk desktop │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 10.3 Typography Scaling

| Element | Mobile (xs-sm) | Tablet (md) | Desktop (lg+) |
|---------|---------------|-------------|----------------|
| `h1` (Hero title) | `text-3xl` (30px) | `text-5xl` (48px) | `text-7xl` (72px) |
| `h2` (Section title) | `text-2xl` (24px) | `text-3xl` (30px) | `text-4xl` (36px) |
| `h3` (Card title) | `text-lg` (18px) | `text-xl` (20px) | `text-2xl` (24px) |
| `h4` (Subsection) | `text-base` (16px) | `text-lg` (18px) | `text-xl` (20px) |
| `body` (Paragraph) | `text-sm` (14px) | `text-base` (16px) | `text-base` (16px) |
| `caption` (Small text) | `text-xs` (12px) | `text-sm` (14px) | `text-sm` (14px) |
| `hero-tagline` | `text-lg` (18px) | `text-2xl` (24px) | `text-3xl` (30px) |
| `nav-link` | `text-base` (16px) | `text-sm` (14px) | `text-sm` (14px) |
| `button` | `text-sm` (14px) | `text-sm` (14px) | `text-base` (16px) |

### 10.4 Responsive Per Komponen — Public Pages

---

#### 🔝 10.4.1 Navbar

**Mobile (< 768px)**
```
┌─────────────────────────────────────┐
│ 🔴 Logo        🌙/☀️   ☰ Hamburger │
└─────────────────────────────────────┘
         │ (ketika ☰ di-tap)
         ▼
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐    │
│  │    Full-screen Overlay      │    │
│  │                             │    │
│  │    ✕ Close                  │    │
│  │                             │    │
│  │    About                    │    │
│  │    ─────────────────        │    │
│  │    Skills                   │    │
│  │    ─────────────────        │    │
│  │    Projects                 │    │
│  │    ─────────────────        │    │
│  │    Experience               │    │
│  │    ─────────────────        │    │
│  │    Contact                  │    │
│  │                             │    │
│  │    [🔴 Hire Me]             │    │
│  │                             │    │
│  │    ── Social Icons ──       │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```
- Hamburger menu → full-screen overlay dengan animasi slide-in
- Menu items besar dengan font `text-2xl`, spacing `py-4` (touch-friendly)
- Logo tetap visible di header
- Theme toggle tetap di header, bukan di dalam menu
- Backdrop blur pada overlay

**Tablet (768px - 1024px)**
```
┌───────────────────────────────────────────────────────┐
│ 🔴 Logo  │  About  Skills  Projects  │  🌙  [Hire Me]│
└───────────────────────────────────────────────────────┘
```
- Horizontal navbar, tapi link dikurangi (hanya 3-4 utama)
- Dropdown "More..." untuk link tambahan
- Logo dan CTA button tetap visible
- `position: sticky`, `backdrop-blur-md`

**Desktop (> 1024px)**
```
┌────────────────────────────────────────────────────────────────────┐
│ 🔴 RianPedia  │  About  Skills  Projects  Experience  Contact  │  🌙/☀️  [🔴 Hire Me] │
└────────────────────────────────────────────────────────────────────┘
```
- Full horizontal navigation
- Semua link visible
- Hover underline animation
- Scroll progress bar di bawah navbar
- Glassmorphism background saat scroll

---

#### 🎬 10.4.2 Hero Section

**Mobile (< 768px)**
```
┌───────────────────────────────┐
│                               │
│  [3D Background - REDUCED]   │
│  (50 particles max,          │
│   no floating shapes)        │
│                               │
│     👋 Hi, I'm               │
│     [Nama]                   │
│                               │
│  [Typing Animation -         │
│   single line]               │
│                               │
│  [Bio singkat 2 baris]       │
│                               │
│  ┌────────────────────┐      │
│  │ 🔴 View Projects   │      │
│  └────────────────────┘      │
│  ┌────────────────────┐      │
│  │ ⚪ Download CV      │      │
│  └────────────────────┘      │
│                               │
│        ↓ Scroll              │
└───────────────────────────────┘
```
- CTA buttons **full-width**, stacked vertikal
- Title menggunakan `text-3xl` (bukan `text-7xl`)
- 3D particles dikurangi ke 50 (dari 200)
- Floating geometric shapes **dimatikan**
- Tinggi section: `min-h-[90vh]`
- Padding horizontal: `px-4`

**Tablet (768px - 1024px)**
```
┌──────────────────────────────────────────────┐
│                                              │
│  [3D Background - MEDIUM: 100 particles,    │
│   2 floating shapes]                         │
│                                              │
│        👋 Hi, I'm [Nama]                     │
│        [Typing: "Full Stack Developer | ..."]│
│                                              │
│        [Bio singkat 3 baris]                 │
│                                              │
│     [🔴 View Projects]  [⚪ Download CV]     │
│                                              │
│              ↓ Scroll                         │
└──────────────────────────────────────────────┘
```
- CTA buttons **inline** (horizontal)
- Title menggunakan `text-5xl`
- 3D particles: 100, 2 floating shapes
- Tinggi section: `min-h-screen`

**Desktop (> 1024px)**
```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  [3D Full Background: 200 particles + network lines +           │
│   5 floating shapes (octahedron, torus, icosahedron)]           │
│                                                                  │
│                 👋 Hi, I'm [Nama]                                │
│       [Typing: "Full Stack Developer | UI/UX Designer |         │
│                Problem Solver"]                                  │
│                                                                  │
│       [Bio singkat — 3-4 baris centered]                        │
│                                                                  │
│          [🔴 View Projects]  [⚪ Download CV]                    │
│                                                                  │
│  [Mouse-follow parallax effect on 3D shapes]                    │
│                    ↓ Scroll                                      │
└──────────────────────────────────────────────────────────────────┘
```
- Full 3D dengan 200 particles + network connections
- Mouse-reactive camera parallax
- Title `text-7xl` dengan glow effect
- Floating shapes: 5 geometries dengan wireframe merah

---

#### 👤 10.4.3 About Section

**Mobile**
```
┌──────────────────────────┐
│  ┌────────────────────┐  │
│  │   [Foto Profil]    │  │
│  │   (rounded,        │  │
│  │    240x240px)      │  │
│  └────────────────────┘  │
│                          │
│  Tentang Saya            │
│  ─────────────           │
│  Bio lengkap paragraph   │
│  text yang bisa di-scroll│
│  ...                     │
│                          │
│  📍 Jakarta, Indonesia   │
│  🎂 25 Tahun             │
│  💼 Available for Work   │
│                          │
│  [🔴 Read More →]        │
└──────────────────────────┘
```
- Layout: **single column**, foto di atas, teks di bawah
- Foto: `w-60 h-60` centered, rounded
- Info badge: horizontal scrollable row
- Bio: collapsed 4 baris, "Read More" expand

**Tablet**
```
┌───────────────────────────────────────────────┐
│  ┌──────────┐    Tentang Saya                 │
│  │ [Foto]   │    ─────────────                │
│  │ 280x280  │    Bio lengkap paragraph text   │
│  │          │    yang cukup panjang...         │
│  │          │                                  │
│  └──────────┘    📍 Jakarta  🎂 25th  💼 Open │
│                  [🔴 Read More →]              │
└───────────────────────────────────────────────┘
```
- Layout: **2 kolom** (foto kiri 40%, teks kanan 60%)
- Foto: `w-70 h-70`

**Desktop**
```
┌────────────────────────────────────────────────────────────────┐
│  ┌──────────────┐      Tentang Saya                           │
│  │ [3D Photo    │      ─────────────                          │
│  │  Frame -     │      Bio lengkap paragraph text yang cukup  │
│  │  interactive │      panjang dan detail...                   │
│  │  rotation]   │                                              │
│  │  320x320     │      📍 Jakarta, ID  🎂 25 Tahun            │
│  │              │      💼 Available     🎓 S1 Informatika     │
│  └──────────────┘                                              │
│                        [🔴 Read More →]  [⚪ Download CV]     │
└────────────────────────────────────────────────────────────────┘
```
- Layout: **2 kolom** (foto kiri 35%, teks kanan 65%)
- 3D photo frame dengan hover rotation effect
- Bio fully expanded (tanpa "Read More" truncate)

---

#### 🛠️ 10.4.4 Skills Section

**Mobile**
```
┌──────────────────────────┐
│  Skills                  │
│  ─────                   │
│                          │
│  [Tab: Frontend|Backend| │
│   Mobile|DevOps] (scroll)│
│                          │
│  ┌──────┐  ┌──────┐     │
│  │React │  │Next  │     │
│  │ 90%  │  │ 85%  │     │
│  │ ████ │  │ ████ │     │
│  └──────┘  └──────┘     │
│  ┌──────┐  ┌──────┐     │
│  │TS    │  │CSS   │     │
│  │ 88%  │  │ 92%  │     │
│  │ ████ │  │ ████ │     │
│  └──────┘  └──────┘     │
└──────────────────────────┘
```
- **Grid: 2 kolom** (`grid-cols-2`)
- 3D Skill Sphere: **DIMATIKAN**, diganti dengan tab filter
- Category tabs: horizontal scroll
- Progress bar sederhana (bukan circular)
- Card size: compact (`p-3`)

**Tablet**
```
┌───────────────────────────────────────────────┐
│  Skills                                       │
│  ─────                                        │
│  [Tab: Frontend | Backend | Mobile | DevOps]  │
│                                                │
│  ┌────────┐  ┌────────┐  ┌────────┐          │
│  │ React  │  │ Next   │  │ TypeSc │          │
│  │ ⚛️ 90% │  │ ▲ 85%  │  │ 🔷 88% │          │
│  │ ██████ │  │ █████  │  │ ██████ │          │
│  └────────┘  └────────┘  └────────┘          │
│  ┌────────┐  ┌────────┐  ┌────────┐          │
│  │ CSS    │  │ JS     │  │ HTML   │          │
│  │ 🎨 92% │  │ ⚡ 90% │  │ 📄 95% │          │
│  └────────┘  └────────┘  └────────┘          │
└───────────────────────────────────────────────┘
```
- **Grid: 3 kolom** (`grid-cols-3`)
- 3D Skill Sphere: **DIMATIKAN**, tab filter digunakan
- Progress bar dengan ikon
- Card size: medium (`p-4`)

**Desktop**
```
┌───────────────────────────────────────────────────────────────┐
│  Skills                                                       │
│  ─────                                                        │
│                                                               │
│  ┌───────────────────┐   ┌────────┐┌────────┐┌────────┐┌───┐│
│  │ [3D SKILL SPHERE] │   │ React  ││ Next   ││ TypeSc ││...││
│  │                   │   │ ⚛️ 90% ││ ▲ 85%  ││ 🔷 88% ││   ││
│  │  • React          │   │ ██████ ││ █████  ││ ██████ ││   ││
│  │     • Node        │   └────────┘└────────┘└────────┘└───┘│
│  │   • TS  • Python  │   ┌────────┐┌────────┐┌────────┐┌───┐│
│  │     • Docker      │   │ Node   ││ Express││ Python ││...││
│  │  [Interactive     │   │ 🟢 85% ││ 🚂 80% ││ 🐍 75% ││   ││
│  │   Rotate/Zoom]    │   │ █████  ││ ████   ││ ████   ││   ││
│  └───────────────────┘   └────────┘└────────┘└────────┘└───┘│
└───────────────────────────────────────────────────────────────┘
```
- **Layout: 2 area** (3D sphere kiri 40%, grid kanan 60%)
- **Grid kanan: 4 kolom** (`grid-cols-4`)
- 3D Skill Sphere: **AKTIF**, interaktif (drag rotate, zoom)
- Animated progress circular gauge
- Hover: card lift + glow effect

---

#### 📁 10.4.5 Projects Section

**Mobile**
```
┌──────────────────────────┐
│  Featured Projects       │
│  ─────────────           │
│                          │
│  [Filter: All|Web|Mobile]│
│  (horizontal scroll)     │
│                          │
│  ┌──────────────────┐    │
│  │ 🖼️ [Thumbnail]   │    │
│  │ full width       │    │
│  │                  │    │
│  │ Project Title    │    │
│  │ Short desc...    │    │
│  │ ┌────┐┌────┐┌──┐│    │
│  │ │Next││TS  ││..││    │
│  │ └────┘└────┘└──┘│    │
│  │ [Live] [GitHub]  │    │
│  └──────────────────┘    │
│                          │
│  ┌──────────────────┐    │
│  │ 🖼️ [Thumbnail]   │    │
│  │ ...              │    │
│  └──────────────────┘    │
│                          │
│  [View All Projects →]   │
└──────────────────────────┘
```
- **Grid: 1 kolom** (`grid-cols-1`)
- Thumbnail: full-width, aspect ratio 16:9
- Card: vertical layout, no 3D hover effect
- Filter tabs: horizontal scroll
- Show 3 projects, "View All" link
- Touch: swipe horizontal (optional carousel)

**Tablet**
```
┌───────────────────────────────────────────────┐
│  Featured Projects                            │
│  ─────────────                                │
│  [Filter: All | Web | Mobile | API]           │
│                                                │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ 🖼️ Thumb     │  │ 🖼️ Thumb     │           │
│  │              │  │              │           │
│  │ Title        │  │ Title        │           │
│  │ Desc...      │  │ Desc...      │           │
│  │ [Tags]       │  │ [Tags]       │           │
│  │ [Live][Code] │  │ [Live][Code] │           │
│  └──────────────┘  └──────────────┘           │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ ...          │  │ ...          │           │
│  └──────────────┘  └──────────────┘           │
│                                                │
│          [View All Projects →]                 │
└───────────────────────────────────────────────┘
```
- **Grid: 2 kolom** (`grid-cols-2`)
- Thumbnail: aspect ratio 16:9
- Subtle hover: scale 1.02 + shadow
- Show 4 projects

**Desktop**
```
┌──────────────────────────────────────────────────────────────┐
│  Featured Projects                                           │
│  ─────────────                                               │
│  [Filter: All | Web | Mobile | Desktop | API | Other]       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ 🖼️ Thumb     │  │ 🖼️ Thumb     │  │ 🖼️ Thumb     │      │
│  │ [3D tilt     │  │ [3D tilt     │  │ [3D tilt     │      │
│  │  on hover]   │  │  on hover]   │  │  on hover]   │      │
│  │ Title        │  │ Title        │  │ Title        │      │
│  │ Desc...      │  │ Desc...      │  │ Desc...      │      │
│  │ [Tags]       │  │ [Tags]       │  │ [Tags]       │      │
│  │ [Live][Code] │  │ [Live][Code] │  │ [Live][Code] │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│              [View All Projects →]                           │
└──────────────────────────────────────────────────────────────┘
```
- **Grid: 3 kolom** (`grid-cols-3`)
- 3D tilt card effect (react-tilt / vanilla-tilt)
- Hover: card lift + parallax depth + red glow
- Show 6 projects
- Animated filter transition (Framer Motion layout)

---

#### 💼 10.4.6 Experience Timeline

**Mobile**
```
┌──────────────────────────┐
│  Experience              │
│  ──────────              │
│                          │
│  │ 2026                  │
│  ●────────────────────   │
│  │ Senior Developer      │
│  │ Company A             │
│  │ Jakarta • Present     │
│  │ Deskripsi singkat...  │
│  │                       │
│  │ 2025                  │
│  ●────────────────────   │
│  │ Full Stack Dev        │
│  │ Company B             │
│  │ Remote • 2024-2025    │
│  │ Deskripsi singkat...  │
│  │                       │
│  │ 2024                  │
│  ●────────────────────   │
│  │ Junior Developer      │
│  │ Company C             │
│  │ Bandung • 2023-2024   │
└──────────────────────────┘
```
- Timeline: **single-side (kiri)**, line vertikal di kiri
- Cards: full-width setelah line
- Scroll-triggered fade-in animation (sederhana)
- Logo perusahaan: 32x32px

**Tablet**
```
┌───────────────────────────────────────────────┐
│  Experience                                    │
│  ──────────                                    │
│                                                │
│  │ 2026                                        │
│  ●─── ┌────────────────────────────────┐      │
│  │    │ 🏢 Senior Developer           │      │
│  │    │ Company A • Jakarta • Present │      │
│  │    │ Deskripsi pekerjaan lengkap... │      │
│  │    └────────────────────────────────┘      │
│  │                                             │
│  │ 2025                                        │
│  ●─── ┌────────────────────────────────┐      │
│  │    │ 🏢 Full Stack Developer       │      │
│  │    │ Company B • Remote            │      │
│  │    │ Deskripsi pekerjaan lengkap... │      │
│  │    └────────────────────────────────┘      │
└───────────────────────────────────────────────┘
```
- Timeline: **single-side (kiri)** dengan cards yang lebih lebar
- Cards: glassmorphism style, max-width 85%
- Logo perusahaan: 40x40px
- Scroll-triggered slide-in dari kanan

**Desktop**
```
┌──────────────────────────────────────────────────────────────┐
│  Experience                                                  │
│  ──────────                                                  │
│                                                              │
│  ┌──────────────────┐       ┌──────────────────┐            │
│  │ 🏢 Senior Dev    │       │                  │            │
│  │ Company A        │  2026 │                  │            │
│  │ Jakarta          │───●───│                  │            │
│  │ Deskripsi...     │   │   │                  │            │
│  └──────────────────┘   │   │ 🏢 Full Stack    │            │
│                         │   │ Company B         │            │
│                    2025 │───│ Remote            │            │
│                         │   │ Deskripsi...      │            │
│  ┌──────────────────┐   │   └──────────────────┘            │
│  │ 🏢 Junior Dev    │   │                                    │
│  │ Company C        │───●                                    │
│  │ Bandung     2024 │                                        │
│  │ Deskripsi...     │                                        │
│  └──────────────────┘                                        │
└──────────────────────────────────────────────────────────────┘
```
- Timeline: **alternating sides** (zig-zag kiri-kanan)
- Line vertikal di tengah dengan animated dot
- Cards: glassmorphism, hover glow effect
- Logo perusahaan: 48x48px
- Scroll-triggered slide-in dari kiri/kanan alternating
- Animated connecting lines

---

#### 🏆 10.4.7 Achievements Section

| Aspek | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| Grid | `grid-cols-1` | `grid-cols-2` | `grid-cols-3` |
| Card | Compact, horizontal layout (icon + text) | Vertical card, medium | Vertical card, large + hover glow |
| Badge image | 40x40px | 56x56px | 64x64px |
| Animation | Fade-in on scroll | Slide-up staggered | 3D flip reveal + glow |

---

#### 🎮 10.4.8 Hobbies Section

| Aspek | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| Grid | `grid-cols-2` (compact) | `grid-cols-3` | `grid-cols-4` atau `flex wrap` |
| Card style | Icon + nama saja | Icon + nama + short desc | Full card + image + desc + hover animation |
| Icon size | 32x32px | 40x40px | 48x48px |
| Interaction | Tap to expand | Tap to expand | Hover: scale + description reveal |

---

#### 📸 10.4.9 Photo Gallery

**Mobile**
```
┌──────────────────────────┐
│  ┌──────────────────┐    │
│  │ [Photo 1]        │    │
│  │ full-width       │    │
│  └──────────────────┘    │
│  ┌────────┐ ┌────────┐   │
│  │Photo 2 │ │Photo 3 │   │
│  └────────┘ └────────┘   │
│  ┌──────────────────┐    │
│  │ [Photo 4]        │    │
│  └──────────────────┘    │
└──────────────────────────┘
```
- **Masonry: 2 kolom** (`columns-2`)
- Lightbox: full-screen overlay, swipe navigasi
- Lazy loading dengan skeleton placeholder

**Tablet**
- **Masonry: 3 kolom** (`columns-3`)
- Lightbox: centered modal, 80% viewport
- Hover: subtle zoom 1.05

**Desktop**
- **Masonry: 4 kolom** (`columns-4`)
- Lightbox: centered modal, arrow navigation + keyboard
- Hover: zoom 1.08 + caption overlay slide-up
- Parallax scroll effect pada gallery

---

#### 📬 10.4.10 Contact Section

**Mobile**
```
┌──────────────────────────┐
│  Contact Me              │
│  ──────────              │
│                          │
│  📍 Jakarta, Indonesia   │
│  📧 rian@email.com       │
│  📱 +62 812-xxxx-xxxx    │
│                          │
│  ┌──────────────────┐    │
│  │ Name [________]  │    │
│  │ Email [_______]  │    │
│  │ Subject [_____]  │    │
│  │ Message          │    │
│  │ [_______________]│    │
│  │ [_______________]│    │
│  │                  │    │
│  │ [🔴 Send Message]│    │
│  └──────────────────┘    │
│                          │
│  ── Social Links ──      │
│  [GH] [LI] [TW] [IG]   │
└──────────────────────────┘
```
- Layout: **single column** — info → form → social
- Form: full-width inputs
- Social icons: horizontal row, centered

**Tablet**
```
┌───────────────────────────────────────────────┐
│  ┌────────────────────┐  ┌────────────────┐   │
│  │ Contact Form       │  │ Info & Social  │   │
│  │ [Name____]         │  │                │   │
│  │ [Email___]         │  │ 📍 Jakarta     │   │
│  │ [Subject_]         │  │ 📧 email       │   │
│  │ [Message_______]   │  │ 📱 phone       │   │
│  │ [______________]   │  │                │   │
│  │ [🔴 Send Message]  │  │ ── Socials ── │   │
│  └────────────────────┘  │ [GH][LI][TW]  │   │
│                          └────────────────┘   │
└───────────────────────────────────────────────┘
```
- Layout: **2 kolom** (form kiri 60%, info kanan 40%)

**Desktop**
- Layout: **2 kolom** (form kiri 55%, info + map/3D kanan 45%)
- 3D animated mail icon / globe
- Social links: vertical list dengan hover animation

---

#### 🦶 10.4.11 Footer

| Aspek | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| Layout | Stacked column | 2 kolom | 3-4 kolom horizontal |
| Logo | Centered, small | Left-aligned | Left-aligned |
| Links | Centered list | 2 kolom grid | 3 kolom grid |
| Social icons | Centered row | Left-aligned row | Left-aligned row |
| Copyright | Centered | Left-aligned | Left-aligned |
| Back to Top | Floating button bottom-right | Same | Same |

---

### 10.5 Responsive — Admin Panel

#### 10.5.1 Admin Layout

**Mobile (< 768px)**
```
┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │ ☰ Admin Panel    🔔  👤    │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Main Content - Full Width]     │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ DataTable (horizontal scroll)│ │
│ │ ◄──────────────────────────►│ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Bottom Navigation Bar       │ │
│ │ 🏠  📁  📸  📬  ⚙️         │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘

(ketika ☰ di-tap → Sheet dari kiri)
┌──────────────┐──────────────────┐
│  SIDEBAR     │                  │
│  (Sheet)     │  (dimmed         │
│              │   backdrop)      │
│ 🏠 Dashboard │                  │
│ 👤 About     │                  │
│ 🛠️ Skills    │                  │
│ 📁 Projects  │                  │
│ 💼 Experience│                  │
│ 🏆 Achieve.  │                  │
│ ...          │                  │
│ 🚪 Logout    │                  │
└──────────────┘──────────────────┘
```
- Sidebar: **Sheet/Drawer** dari kiri (shadcn `Sheet`)
- Bottom navigation bar untuk 5 menu utama (quick access)
- DataTable: **horizontal scroll** (overflow-x-auto)
- Stats cards: **2 kolom grid** (`grid-cols-2`)
- Form dialog: **full-screen modal** (bukan centered modal)
- Image uploader: full-width dropzone

**Tablet (768px - 1024px)**
```
┌──────────┬──────────────────────────────────┐
│ SIDEBAR  │  Main Content                    │
│ (icons   │                                  │
│  only)   │  ┌──────┐┌──────┐┌──────┐┌────┐│
│          │  │Stats ││Stats ││Stats ││St. ││
│ 🏠       │  └──────┘└──────┘└──────┘└────┘│
│ 👤       │                                  │
│ 🛠️       │  ┌──────────────────────────┐   │
│ 📁       │  │ DataTable               │   │
│ 💼       │  │ (full table visible)    │   │
│ 🏆       │  │                         │   │
│ 🎓       │  └──────────────────────────┘   │
│ 🎮       │                                  │
│ 📸       │  [+ Add New]                    │
│ 📬       │                                  │
│ ⚙️       │                                  │
│ 🚪       │                                  │
└──────────┴──────────────────────────────────┘
```
- Sidebar: **collapsed** (icons only, width 64px), expand on hover
- Stats cards: **4 kolom grid** (`grid-cols-4`)
- DataTable: full table visible
- Form dialog: centered modal (max-width 600px)

**Desktop (> 1024px)**
```
┌────────────────┬─────────────────────────────────────────────┐
│   SIDEBAR      │  Header: Dashboard          🔍  🔔  👤    │
│   (full)       ├─────────────────────────────────────────────┤
│                │                                             │
│ 🏠 Dashboard   │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐     │
│ 👤 About Me    │  │ 12   │ │ 8    │ │ 5    │ │ 24   │     │
│ 🛠️ Skills      │  │Skills│ │Proj. │ │Exp.  │ │Msgs  │     │
│ 📁 Projects    │  └──────┘ └──────┘ └──────┘ └──────┘     │
│ 💼 Experience  │                                             │
│ 🏆 Achievements│  ┌─────────────────────────────────────┐   │
│ 🎓 Education   │  │ Full DataTable with all columns     │   │
│ 🎮 Hobbies     │  │ Sorting | Filtering | Pagination    │   │
│ 📸 Photos      │  │                                     │   │
│ 📬 Messages    │  │ Row actions: Edit | Delete          │   │
│ 🔗 Socials     │  └─────────────────────────────────────┘   │
│ ⚙️ Settings    │                                             │
│                │  [+ Add New]                                │
│ 🚪 Logout      │                                             │
└────────────────┴─────────────────────────────────────────────┘
```
- Sidebar: **full expanded** (width 256px), labels + icons
- Stats cards: **4 kolom grid**
- DataTable: all columns visible, inline actions
- Form dialog: centered modal (max-width 720px)
- Split view option untuk photo management

#### 10.5.2 Admin DataTable Responsive

| Kolom | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| #/ID | ❌ Hidden | ❌ Hidden | ✅ Visible |
| Thumbnail | ✅ Small (32px) | ✅ Medium (40px) | ✅ Large (48px) |
| Name/Title | ✅ Truncated (20 char) | ✅ Truncated (30 char) | ✅ Full |
| Category | ❌ Hidden (shown in detail) | ✅ Badge | ✅ Badge |
| Status | ✅ Dot indicator only | ✅ Badge | ✅ Full badge |
| Date | ❌ Hidden | ✅ Short (Jun 20) | ✅ Full (20 Jun 2026) |
| Actions | ✅ `⋮` dropdown | ✅ `⋮` dropdown | ✅ Inline buttons |
| Sort/Filter | Bottom sheet | Inline controls | Inline controls |
| Pagination | Simple (Prev/Next) | Numbered | Numbered + page size |

#### 10.5.3 Admin Form Dialog Responsive

| Aspek | Mobile | Tablet | Desktop |
|-------|--------|--------|---------|
| Display | Full-screen sheet (bottom) | Centered dialog (80% width) | Centered dialog (max 720px) |
| Fields layout | Single column | Single column | 2 kolom untuk paired fields |
| Image preview | 120px thumbnail | 200px thumbnail | 300px preview |
| Rich text editor | Simplified toolbar | Standard toolbar | Full toolbar |
| Buttons | Full-width stacked | Right-aligned inline | Right-aligned inline |
| Close | Swipe down + ✕ button | ✕ button | ✕ button + ESC key |

---

### 10.6 3D Effects Performance Tiering

```
┌──────────────────────────────────────────────────────────────┐
│          3D PERFORMANCE TIERS PER DEVICE                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  TIER 1 — MOBILE (< 768px, touch devices)                    │
│  ┌──────────────────────────────────────────────────┐        │
│  │ • Particle count:    50 (max)                    │        │
│  │ • Floating shapes:   DISABLED                    │        │
│  │ • Skill sphere:      DISABLED (use flat grid)   │        │
│  │ • Card 3D tilt:      DISABLED (use scale only)  │        │
│  │ • Background grid:   DISABLED                    │        │
│  │ • Cursor trail:      DISABLED                    │        │
│  │ • Pixel ratio:       1 (fixed)                   │        │
│  │ • Frame rate:        30fps cap                   │        │
│  │ • Canvas resolution: 50% of viewport             │        │
│  │ • Fallback:          CSS gradient + subtle glow  │        │
│  └──────────────────────────────────────────────────┘        │
│                                                               │
│  TIER 2 — TABLET (768px - 1024px)                            │
│  ┌──────────────────────────────────────────────────┐        │
│  │ • Particle count:    100                         │        │
│  │ • Floating shapes:   2 shapes (low-poly)        │        │
│  │ • Skill sphere:      DISABLED                    │        │
│  │ • Card 3D tilt:      ENABLED (subtle)           │        │
│  │ • Background grid:   SIMPLIFIED (fewer lines)   │        │
│  │ • Cursor trail:      DISABLED                    │        │
│  │ • Pixel ratio:       min(devicePixelRatio, 1.5) │        │
│  │ • Frame rate:        30-60fps                    │        │
│  │ • Canvas resolution: 75% of viewport             │        │
│  └──────────────────────────────────────────────────┘        │
│                                                               │
│  TIER 3 — DESKTOP (> 1024px)                                 │
│  ┌──────────────────────────────────────────────────┐        │
│  │ • Particle count:    200                         │        │
│  │ • Floating shapes:   5 shapes (medium-poly)     │        │
│  │ • Skill sphere:      ENABLED (full interactive) │        │
│  │ • Card 3D tilt:      ENABLED (full parallax)    │        │
│  │ • Background grid:   FULL (animated Tron-style) │        │
│  │ • Cursor trail:      ENABLED                    │        │
│  │ • Pixel ratio:       min(devicePixelRatio, 2)   │        │
│  │ • Frame rate:        60fps                       │        │
│  │ • Canvas resolution: 100% of viewport            │        │
│  └──────────────────────────────────────────────────┘        │
│                                                               │
│  DETEKSI DEVICE:                                              │
│  ┌──────────────────────────────────────────────────┐        │
│  │ const tier = useMemo(() => {                     │        │
│  │   const width = window.innerWidth                │        │
│  │   const isMobile = width < 768                   │        │
│  │     || 'ontouchstart' in window                  │        │
│  │   const isTablet = width >= 768 && width < 1024 │        │
│  │   const gpu = navigator.gpu                      │        │
│  │     ? 'high' : 'standard'                        │        │
│  │   if (isMobile) return 'TIER_1'                  │        │
│  │   if (isTablet) return 'TIER_2'                  │        │
│  │   return 'TIER_3'                                │        │
│  │ }, [])                                           │        │
│  └──────────────────────────────────────────────────┘        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 10.7 Touch & Interaction Patterns

| Interaksi | Mobile (Touch) | Tablet (Touch + Pointer) | Desktop (Mouse + Keyboard) |
|-----------|---------------|--------------------------|---------------------------|
| Navigation | Tap menu items | Tap menu items | Hover + Click |
| Project cards | Tap to open detail | Tap to open detail | Hover 3D tilt + click |
| Photo gallery | Tap to lightbox, swipe | Tap to lightbox, swipe/arrow | Click lightbox, arrow keys |
| 3D Sphere | Swipe to rotate (touch) | Swipe to rotate | Click-drag rotate + scroll zoom |
| Timeline | Scroll to reveal | Scroll to reveal | Scroll to reveal + hover expand |
| Theme toggle | Tap icon | Tap icon | Click icon + keyboard shortcut (⌘/Ctrl+D) |
| Admin tables | Swipe row for actions | Tap `⋮` for actions | Hover row → inline action buttons |
| Form submit | Tap button | Tap button | Click button / Enter key |
| Image upload | Tap to open file picker | Tap to open / drag-drop | Click browse / drag-drop zone |
| Scroll | Native momentum scroll | Native scroll | Smooth scroll + scroll-snap |
| Back to top | Tap floating button | Tap floating button | Click button / Home key |

### 10.8 Touch Target Minimum Sizes

```
┌──────────────────────────────────────────────────────────────┐
│          TOUCH TARGET REQUIREMENTS (WCAG 2.5.8)              │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  • Minimum touch target: 44px × 44px                         │
│  • Recommended target:   48px × 48px                         │
│  • Spacing between:      ≥ 8px                               │
│                                                               │
│  Komponen yang harus comply:                                  │
│  ├── Navbar menu items          → min-height: 48px           │
│  ├── CTA buttons                → min-height: 48px, px: 24  │
│  ├── Tab filter buttons         → min-height: 44px           │
│  ├── Social link icons          → 44px × 44px               │
│  ├── Admin table action buttons → 44px × 44px               │
│  ├── Form input fields          → min-height: 44px           │
│  ├── Theme toggle               → 44px × 44px               │
│  ├── Hamburger menu icon        → 48px × 48px               │
│  ├── Gallery thumbnails         → min 80px × 80px           │
│  ├── Pagination buttons         → 44px × 44px               │
│  └── Close/dismiss buttons      → 44px × 44px               │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### 10.9 Responsive Images Strategy

| Context | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero background | 640w, WebP/AVIF | 1024w, WebP/AVIF | 1920w, WebP/AVIF |
| Profile photo | 240w × 240h | 280w × 280h | 320w × 320h |
| Project thumbnail | 320w (full-width card) | 360w (half card) | 400w (third card) |
| Gallery photo | 300w (half masonry) | 280w (third masonry) | 350w (quarter masonry) |
| Company logo | 32w × 32h | 40w × 40h | 48w × 48h |
| Skill icon | 24w × 24h | 32w × 32h | 40w × 40h |
| Certificate badge | 40w × 40h | 56w × 56h | 64w × 64h |

**Next.js Image Configuration:**
```tsx
// next.config.ts
images: {
  deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
  imageSizes: [32, 48, 64, 96, 128, 256, 384],
  formats: ['image/avif', 'image/webp'],
}
```

### 10.10 Responsive Testing Checklist

#### Device Matrix (Wajib Ditest)

| Device Category | Resolusi | Orientation | Prioritas |
|----------------|----------|-------------|-----------|
| **iPhone SE** | 375 × 667 | Portrait | 🔴 High |
| **iPhone 14/15** | 390 × 844 | Portrait | 🔴 High |
| **iPhone 14 Pro Max** | 430 × 932 | Portrait | 🟡 Medium |
| **Samsung Galaxy S23** | 360 × 780 | Portrait | 🔴 High |
| **Pixel 7** | 412 × 915 | Portrait | 🟡 Medium |
| **iPad Mini** | 768 × 1024 | Both | 🔴 High |
| **iPad Air** | 820 × 1180 | Both | 🔴 High |
| **iPad Pro 12.9"** | 1024 × 1366 | Both | 🟡 Medium |
| **Samsung Galaxy Tab S8** | 800 × 1280 | Both | 🟡 Medium |
| **Laptop 13"** | 1280 × 800 | Landscape | 🔴 High |
| **Laptop 15"** | 1440 × 900 | Landscape | 🔴 High |
| **Desktop FHD** | 1920 × 1080 | Landscape | 🔴 High |
| **Desktop QHD** | 2560 × 1440 | Landscape | 🟡 Medium |
| **Desktop 4K** | 3840 × 2160 | Landscape | 🟢 Low |
| **Ultra-wide** | 3440 × 1440 | Landscape | 🟢 Low |

#### Aspek yang Harus Diverifikasi Per Breakpoint

- [ ] Navbar collapse/expand benar
- [ ] Tidak ada horizontal overflow (no unwanted scrollbar)
- [ ] Semua teks readable (tidak terpotong atau terlalu kecil)
- [ ] Gambar tidak distorsi (aspect ratio terjaga)
- [ ] Touch targets memenuhi minimum 44px
- [ ] Form inputs mudah digunakan (tidak terlalu kecil)
- [ ] 3D effects sesuai tier (tidak lag di mobile)
- [ ] Modal/Dialog sesuai ukuran viewport
- [ ] Admin DataTable bisa di-scroll horizontal di mobile
- [ ] Lightbox gallery berfungsi (swipe di mobile, arrow di desktop)
- [ ] Dark/Light mode konsisten di semua breakpoints
- [ ] Loading states (skeleton) responsive
- [ ] Error states responsive
- [ ] Empty states responsive
- [ ] Print stylesheet (optional) terformat rapi

---

## ⚡ 11. Performa & Optimasi

### 11.1 Strategi

| Aspek | Implementasi |
|-------|-------------|
| **Rendering** | SSG untuk public pages, ISR untuk konten dinamis (revalidate 60s) |
| **Images** | Next.js `<Image>` component, auto WebP/AVIF, lazy loading |
| **3D Loading** | Lazy load Three.js canvas, show fallback gradient saat loading |
| **Code Splitting** | Dynamic imports untuk komponen berat (`next/dynamic`) |
| **Fonts** | `next/font` untuk Google Fonts (no layout shift) |
| **Bundle Size** | Tree-shaking, analyze with `@next/bundle-analyzer` |
| **Caching** | ISR + CDN caching headers, Supabase query caching |
| **3D Performance** | Reduce polygon count mobile, `useFrame` throttle, dispose geometries |

### 11.2 Target Metrics

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 90 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.5s |
| Cumulative Layout Shift | < 0.1 |

---

## 🚀 12. Deployment & Environment

### 12.1 Environment Variables

```env
# ─── Supabase ───
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# ─── Express.js Backend ───
EXPRESS_PORT=4000
CORS_ORIGIN=https://rianpedia.com
JWT_SECRET=super-secret-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ─── Next.js ───
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=https://rianpedia.com
REVALIDATION_SECRET=secret-for-on-demand-isr

# ─── File Upload ───
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/svg+xml
```

### 12.2 Deployment Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    DEPLOYMENT                             │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐    ┌──────────────┐   ┌──────────────┐│
│  │   Vercel     │    │  Railway /   │   │  Supabase    ││
│  │  (Frontend)  │    │  Render      │   │  (Cloud)     ││
│  │              │    │  (Backend)   │   │              ││
│  │ • Next.js    │◄──►│ • Express.js │◄─►│ • PostgreSQL ││
│  │ • SSR/SSG    │    │ • REST API   │   │ • Auth       ││
│  │ • Edge Fn.   │    │ • File proxy │   │ • Storage    ││
│  │ • CDN        │    │ • Cron jobs  │   │ • Realtime   ││
│  └──────────────┘    └──────────────┘   └──────────────┘│
│                                                           │
│  Domain: rianpedia.com → Vercel                          │
│  API:    api.rianpedia.com → Railway/Render              │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## 📅 13. Milestone & Roadmap

### Phase 1: Foundation (Minggu 1-2)

- [x] PRD Document
- [ ] Setup monorepo (Next.js + Express.js)
- [ ] Setup Supabase project + migrations
- [ ] Setup Tailwind CSS + shadcn/ui + theme
- [ ] Implement auth flow (Express.js + Supabase Auth)
- [ ] Base layout (Navbar, Footer, ThemeToggle)

### Phase 2: Backend API (Minggu 2-3)

- [ ] Express.js server setup + middleware
- [ ] All CRUD endpoints (about, skills, projects, experience, etc.)
- [ ] File upload endpoint + Supabase Storage
- [ ] Input validation (Zod)
- [ ] Error handling & logging
- [ ] API testing

### Phase 3: Admin Panel (Minggu 3-4)

- [ ] Admin layout + sidebar (shadcn/ui)
- [ ] Login page
- [ ] Dashboard overview
- [ ] CRUD pages untuk semua konten
- [ ] Image uploader component
- [ ] Rich text editor
- [ ] DataTable dengan sorting, filter, pagination
- [ ] Toast notifications

### Phase 4: Public Frontend (Minggu 4-6)

- [ ] Hero Section + 3D particle background
- [ ] About Section + foto interaktif
- [ ] Skills Section + 3D skill sphere
- [ ] Projects Section + 3D card effects
- [ ] Experience Timeline + scroll animations
- [ ] Achievements showcase
- [ ] Hobbies & interests
- [ ] Photo gallery (masonry + lightbox)
- [ ] Contact form + social links
- [ ] Footer

### Phase 5: 3D Effects & Animations (Minggu 6-7)

- [ ] Three.js background scenes
- [ ] React Three Fiber components
- [ ] Framer Motion scroll animations
- [ ] Micro-interactions & hover effects
- [ ] Cursor trail effect
- [ ] Loading animations
- [ ] Page transitions

### Phase 6: Polish & Deploy (Minggu 7-8)

- [ ] SEO optimization (metadata, OG images, sitemap)
- [ ] Performance optimization
- [ ] Responsive testing semua breakpoints
- [ ] Cross-browser testing
- [ ] Accessibility audit
- [ ] Deploy to Vercel + Railway/Render
- [ ] Domain setup + SSL
- [ ] Seed initial data

---

## 📎 14. Referensi Teknis (Context7)

### Next.js App Router

- **Metadata API**: Gunakan `export const metadata: Metadata` atau `generateMetadata()` untuk SEO dinamis per halaman
- **API Routes**: File `route.ts` di dalam `/app/api/` untuk handler GET, POST, PUT, DELETE
- **Server Components**: Default di App Router, gunakan `'use client'` hanya untuk interaktivitas
- **Project Structure**: File-based routing di `/app`, layout nesting, group routes `(admin)`, `(public)`

### Supabase

- **TypeScript Types**: Generate via `supabase gen types typescript --project-id <id> > database.types.ts`
- **Client Init**: `createClient<Database>(url, key)` untuk type-safe queries
- **CRUD Pattern**: `.from('table').select('*')`, `.insert()`, `.update()`, `.delete()` dengan `.match()` atau `.eq()`
- **RLS**: Row Level Security policies untuk kontrol akses per tabel
- **Storage**: Bucket-based file storage dengan public/private access

### shadcn/ui

- **Instalasi**: `npx shadcn@latest add <component-names>`
- **Dark Mode**: `ThemeProvider` dari `next-themes` dengan `attribute="class"`
- **Layout**: Root layout dengan `ThemeProvider` wrapper, font variables via `next/font`
- **Sidebar**: Pattern sidebar dengan `SidebarHeader`, `SidebarContent`, `SidebarFooter`, nav groups
- **Theming**: CSS variables di `globals.css` untuk light/dark, customizable per komponen

### Three.js + React Three Fiber

- **Setup**: `@react-three/fiber` sebagai React renderer, `@react-three/drei` untuk helpers
- **Performance**: Lazy load canvas, reduce geometry untuk mobile, gunakan `instancedMesh` untuk particles
- **Interaktif**: `useFrame` untuk animasi, `raycaster` untuk mouse interaction

---

## 📝 15. Glossary

| Term | Deskripsi |
|------|-----------|
| **SSR** | Server-Side Rendering — halaman dirender di server |
| **SSG** | Static Site Generation — halaman di-generate saat build |
| **ISR** | Incremental Static Regeneration — SSG yang bisa revalidate |
| **RLS** | Row Level Security — policy akses per baris di PostgreSQL |
| **JWT** | JSON Web Token — token autentikasi stateless |
| **CRUD** | Create, Read, Update, Delete |
| **R3F** | React Three Fiber — React renderer untuk Three.js |
| **shadcn/ui** | Collection of UI components berbasis Radix UI + Tailwind |
| **Glassmorphism** | Desain transparan dengan blur effect |
| **Web3 Aesthetic** | Desain futuristik terinspirasi blockchain/metaverse UI |

---

> **Dokumen ini akan terus diperbarui seiring perkembangan proyek.**
> Last updated: 20 Juni 2026
