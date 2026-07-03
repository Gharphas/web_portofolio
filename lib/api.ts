// ═══════════════════════════════════════════
// Express API Client Wrapper
// Centralized API calls with auth, error handling
// ═══════════════════════════════════════════

import type { ApiResponse, AuthResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("jemiarian_admin_token");
  if (!token || token === "undefined" || token === "null") return null;
  return token;
}

function setToken(token: string): void {
  localStorage.setItem("jemiarian_admin_token", token);
}

function removeToken(): void {
  localStorage.removeItem("jemiarian_admin_token");
}

// ─── Base Fetch Wrapper ───
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json.error || {
          code: `HTTP_${res.status}`,
          message: json.message || `Request failed with status ${res.status}`,
        },
      };
    }

    return json as ApiResponse<T>;
  } catch (err: any) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: err.message || "Gagal terhubung ke server. Periksa koneksi jaringan Anda.",
      },
    };
  }
}

// ─── Public API Methods (No Auth Required) ───
export const publicApi = {
  getAbout: () => apiFetch("/about"),
  getSkills: () => apiFetch("/skills"),
  getProjects: () => apiFetch("/projects"),
  getProjectBySlug: (slug: string) => apiFetch(`/projects/${slug}`),
  getExperience: () => apiFetch("/experience"),
  getEducation: () => apiFetch("/education"),
  getAchievements: () => apiFetch("/achievements"),
  getHobbies: () => apiFetch("/hobbies"),
  getPhotos: () => apiFetch("/photos"),
  getSocialLinks: () => apiFetch("/social-links"),
  getSettings: () => apiFetch("/settings"),

  // Contact — send message (public)
  sendContactMessage: (data: { name: string; email: string; subject?: string; message: string }) =>
    apiFetch("/contact/send", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// ─── Auth API Methods ───
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiFetch<AuthResponse["data"]>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.success && res.data?.token) {
      setToken(res.data.token);
    }

    return res as unknown as AuthResponse;
  },

  logout: () => {
    removeToken();
    window.location.href = "/login";
  },

  changePassword: (oldPassword: string, newPassword: string) =>
    apiFetch("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
    }),

  changeEmail: (newEmail: string, currentPassword: string) =>
    apiFetch("/auth-internal/change-email", {
      method: "POST",
      body: JSON.stringify({ newEmail, currentPassword }),
    }),
};

// ─── Admin API Methods (Auth Required) ───
export const adminApi = {
  // About
  updateAbout: (data: Record<string, unknown>) =>
    apiFetch("/about", { method: "PUT", body: JSON.stringify(data) }),

  // Skills
  createSkill: (data: Record<string, unknown>) =>
    apiFetch("/skills", { method: "POST", body: JSON.stringify(data) }),
  updateSkill: (id: string, data: Record<string, unknown>) =>
    apiFetch(`/skills/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSkill: (id: string) =>
    apiFetch(`/skills/${id}`, { method: "DELETE" }),
  reorderSkills: (orders: { id: string; sort_order: number }[]) =>
    apiFetch("/skills/reorder", { method: "PUT", body: JSON.stringify({ orders }) }),

  // Projects
  createProject: (data: Record<string, unknown>) =>
    apiFetch("/projects", { method: "POST", body: JSON.stringify(data) }),
  updateProject: (id: string, data: Record<string, unknown>) =>
    apiFetch(`/projects/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProject: (id: string) =>
    apiFetch(`/projects/${id}`, { method: "DELETE" }),

  // Experience
  createExperience: (data: Record<string, unknown>) =>
    apiFetch("/experience", { method: "POST", body: JSON.stringify(data) }),
  updateExperience: (id: string, data: Record<string, unknown>) =>
    apiFetch(`/experience/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteExperience: (id: string) =>
    apiFetch(`/experience/${id}`, { method: "DELETE" }),

  // Education
  createEducation: (data: Record<string, unknown>) =>
    apiFetch("/education", { method: "POST", body: JSON.stringify(data) }),
  updateEducation: (id: string, data: Record<string, unknown>) =>
    apiFetch(`/education/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteEducation: (id: string) =>
    apiFetch(`/education/${id}`, { method: "DELETE" }),

  // Achievements
  createAchievement: (data: Record<string, unknown>) =>
    apiFetch("/achievements", { method: "POST", body: JSON.stringify(data) }),
  updateAchievement: (id: string, data: Record<string, unknown>) =>
    apiFetch(`/achievements/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAchievement: (id: string) =>
    apiFetch(`/achievements/${id}`, { method: "DELETE" }),

  // Hobbies
  createHobby: (data: Record<string, unknown>) =>
    apiFetch("/hobbies", { method: "POST", body: JSON.stringify(data) }),
  updateHobby: (id: string, data: Record<string, unknown>) =>
    apiFetch(`/hobbies/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteHobby: (id: string) =>
    apiFetch(`/hobbies/${id}`, { method: "DELETE" }),

  // Photos
  createPhoto: (data: Record<string, unknown>) =>
    apiFetch("/photos", { method: "POST", body: JSON.stringify(data) }),
  updatePhoto: (id: string, data: Record<string, unknown>) =>
    apiFetch(`/photos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deletePhoto: (id: string) =>
    apiFetch(`/photos/${id}`, { method: "DELETE" }),

  // Contact Messages
  getMessages: () => apiFetch("/contact/messages"),
  markMessageRead: (id: string, isRead: boolean) =>
    apiFetch(`/contact/messages/${id}/read`, {
      method: "PUT",
      body: JSON.stringify({ isRead }),
    }),
  toggleMessageStar: (id: string) =>
    apiFetch(`/contact/messages/${id}/star`, { method: "PUT" }),
  deleteMessage: (id: string) =>
    apiFetch(`/contact/messages/${id}`, { method: "DELETE" }),

  // Social Links
  createSocialLink: (data: Record<string, unknown>) =>
    apiFetch("/social-links", { method: "POST", body: JSON.stringify(data) }),
  updateSocialLink: (id: string, data: Record<string, unknown>) =>
    apiFetch(`/social-links/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteSocialLink: (id: string) =>
    apiFetch(`/social-links/${id}`, { method: "DELETE" }),

  // Settings
  updateSetting: (key: string, data: Record<string, unknown>) =>
    apiFetch(`/settings/${key}`, { method: "PUT", body: JSON.stringify(data) }),
  bulkUpdateSettings: (settings: { key: string; value: unknown; category?: string }[]) =>
    apiFetch("/settings/bulk", { method: "PUT", body: JSON.stringify({ settings }) }),

  // File Upload
  uploadFile: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append("file", file);

    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers,
        body: formData,
      });
      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        error: { code: "UPLOAD_ERROR", message: err.message || "Upload gagal" },
      };
    }
  },
};
