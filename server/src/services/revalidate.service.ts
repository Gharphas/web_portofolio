import { env } from "../config/env";

export class RevalidateService {
  static async triggerRevalidate(path: string) {
    if (!env.REVALIDATION_SECRET) {
      console.log(`[Revalidation Skip] REVALIDATION_SECRET is not defined in environment. Path: ${path}`);
      return;
    }

    // Normalize localhost URLs to http (to avoid SSL validation errors in development)
    let siteUrl = env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1")) {
      siteUrl = siteUrl.replace("https://", "http://");
    }

    const url = `${siteUrl}/api/revalidate?secret=${env.REVALIDATION_SECRET}&path=${path}`;

    try {
      console.log(`[Revalidation Request] Dispatching to path: ${path}`);
      const response = await fetch(url);
      const data = await response.json();
      console.log(`[Revalidation Response] Result:`, data);
    } catch (error) {
      console.error(`[Revalidation Error] Failed to trigger revalidation for path: ${path}`, error);
    }
  }
}
