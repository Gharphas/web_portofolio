import { createAuthClient } from "better-auth/react";

// The baseURL must point to the ROOT of the Express backend server (NOT /api).
// Better Auth Client automatically appends "/api/auth" to this baseURL.
//
// NEXT_PUBLIC_API_URL is typically "http://localhost:4000/api" or "https://rianpedia-backend.vercel.app/api"
// We need to strip the "/api" suffix to get the server root.
const backendRoot = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace(/\/api\/?$/, "");

export const authClient = createAuthClient({
  baseURL: backendRoot,
  fetchOptions: {
    credentials: "include", // Always send cookies for cross-origin auth
  },
});
