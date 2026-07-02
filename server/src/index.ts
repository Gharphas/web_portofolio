import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env, envValidationError } from "./config/env";
import { corsOptions } from "./config/cors";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";
import { initAuth, authInitError } from "./config/auth";
import { seedAdmin } from "./scripts/seed-admin";

const app = express();

// Intercept all requests if environment is invalid
app.use((req, res, next) => {
  if (envValidationError) {
    return res.status(500).json({
      success: false,
      error: {
        code: "ENV_VALIDATION_FAILED",
        message: "Server environment configuration is invalid.",
        details: envValidationError
      }
    });
  }
  next();
});

// Apply security headers
app.use(helmet());

// Apply CORS options
app.use(cors(corsOptions));

// HTTP request logger
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

let adminSeeded = false;

// Better Auth Route Handlers (MUST be defined before body parsers to avoid hanging)
app.all("/api/auth/*", async (req, res, next) => {
  try {
    const authInstance = await initAuth();
    if (authInstance) {
      // Jalankan seeding admin di platform serverless (Vercel) secara background pada request pertama
      if (!adminSeeded) {
        adminSeeded = true;
        seedAdmin().catch(err => {
          console.error("❌ Failed to seed admin in background:", err);
        });
      }
      const importESM = new Function("specifier", "return import(specifier)");
      const { toNodeHandler } = await importESM("better-auth/node");
      return toNodeHandler(authInstance)(req, res);
    }
    res.status(500).json({
      success: false,
      error: {
        code: "AUTH_INIT_FAILED",
        message: "Better Auth failed to initialize.",
        details: authInitError
      }
    });
  } catch (err) {
    next(err);
  }
});

// Body parser configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply global rate limiting to all /api routes
app.use("/api", apiRateLimiter);

// Register base health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Register all API resource routes
app.use("/api", routes);

// Handle unknown route endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Endpoint ${req.method} ${req.path} tidak ditemukan`,
    },
  });
});

// Register global error interceptor
app.use(errorHandler);

// Start server listening (hanya jika tidak dideploy di Vercel Serverless)
if (!process.env.VERCEL) {
  app.listen(env.PORT, async () => {
    console.log(`🚀 JemiArian Backend running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    // Seed admin user
    await seedAdmin();
  });
}

export default app;
