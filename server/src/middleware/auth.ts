import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";
import { env } from "../config/env";

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

    const token = authHeader.split(" ")[1];

    // Bypass otentikasi di mode development jika menggunakan token mock
    if (env.NODE_ENV === "development" && token === "mocked_jwt_token_xyz123") {
      req.user = {
        id: "00000000-0000-0000-0000-000000000000",
        email: "admin@rianpedia.com",
        role: "admin"
      };
      return next();
    }

    // Verify token with Supabase auth service
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Token otentikasi tidak valid atau telah kedaluwarsa.",
        },
      });
    }

    // Check if the user has the admin role in profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "Akses ditolak. Anda tidak memiliki izin administrator.",
        },
      });
    }

    // Attach user information to request
    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}
