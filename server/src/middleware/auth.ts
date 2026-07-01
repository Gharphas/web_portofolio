import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { env } from "../config/env";
import { initAuth } from "../config/auth";

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Token otentikasi tidak ditemukan. Silakan login terlebih dahulu.",
        },
      });
    }

    // Verify session with Better Auth
    const authInstance = await initAuth();
    if (!authInstance) {
      return res.status(500).json({
        success: false,
        error: {
          code: "AUTH_INIT_FAILED",
          message: "Sistem otentikasi gagal diinisialisasi."
        }
      });
    }

    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else if (value) {
        headers.set(key, value);
      }
    });

    const session = await authInstance.api.getSession({
      headers
    });

    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Token otentikasi tidak valid atau telah kedaluwarsa.",
        },
      });
    }

    // Check if the user has the admin role in database
    const { data: dbUser, error: userError } = await supabase
      .from("user")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (userError || !dbUser || dbUser.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Akses ditolak. Anda tidak memiliki izin administrator.",
        },
      });
    }

    // Attach user information to request
    req.user = session.user;
    return next();
  } catch (err) {
    return next(err);
  }
}
