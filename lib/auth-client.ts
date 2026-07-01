import { createAuthClient } from "better-auth/react";

// The baseURL points to the root of the Express backend.
// Better Auth Client automatically appends the default prefix "/api/auth".
export const authClient = createAuthClient({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api").replace(/\/api$/, "")
});
