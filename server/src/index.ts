import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { corsOptions } from "./config/cors";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app = express();

// Apply security headers
app.use(helmet());

// Apply CORS options
app.use(cors(corsOptions));

// Body parser configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logger
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

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
  app.listen(env.PORT, () => {
    console.log(`🚀 RianPedia Backend running in ${env.NODE_ENV} mode on port ${env.PORT}`);
  });
}

export default app;
