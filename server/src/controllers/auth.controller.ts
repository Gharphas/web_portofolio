import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthenticatedRequest } from "../middleware/auth";

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      
      res.status(200).json({
        success: true,
        message: "Login berhasil",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await AuthService.logout();
      res.status(200).json({
        success: true,
        message: "Logout berhasil",
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await AuthService.getProfile(req.user.id);
      res.status(200).json({
        success: true,
        data: {
          id: req.user.id,
          email: req.user.email,
          full_name: profile.name,
          avatar_url: profile.image,
          role: profile.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { full_name, avatar_url } = req.body;
      const profile = await AuthService.updateProfile(req.user.id, full_name, avatar_url);
      
      res.status(200).json({
        success: true,
        message: "Profil berhasil diperbarui",
        data: {
          id: profile.id,
          email: profile.email,
          full_name: profile.name,
          avatar_url: profile.image,
          role: profile.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { newPassword } = req.body;
      await AuthService.changePassword(newPassword);
      
      res.status(200).json({
        success: true,
        message: "Password berhasil diganti",
      });
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "Refresh token wajib dikirim",
          },
        });
      }
      const session = await AuthService.refreshSession(refreshToken);
      
      res.status(200).json({
        success: true,
        message: "Sesi berhasil diperbarui",
        data: { session },
      });
    } catch (err) {
      next(err);
    }
  }
}
