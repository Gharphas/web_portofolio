import rateLimit from "express-rate-limit";

// Rate limiting for public contact message form submissions: max 5 requests per 15 minutes
export const contactRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Terlalu banyak pengiriman pesan dari perangkat Anda. Silakan coba lagi setelah 15 menit.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiter for overall API endpoints: max 100 requests per 15 minutes
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Terlalu banyak permintaan API dari IP Anda. Silakan coba lagi nanti.",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
