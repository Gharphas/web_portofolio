import { createAuthClient } from "better-auth/react";

// The baseURL points to the Express backend API.
// Better Auth Client automatically appends "/auth" to this URL.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"
});
