import { Request, Response, NextFunction } from "express";
import { AchievementsService } from "../services/achievements.service";
import { RevalidateService } from "../services/revalidate.service";

export class AchievementsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AchievementsService.getAll();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AchievementsService.getById(req.params.id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AchievementsService.create(req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");

      res.status(201).json({
        success: true,
        message: "Prestasi baru berhasil ditambahkan",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AchievementsService.update(req.params.id, req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");

      res.status(200).json({
        success: true,
        message: "Prestasi berhasil diperbarui",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await AchievementsService.delete(req.params.id);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");

      res.status(200).json({
        success: true,
        message: "Prestasi berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  }
}
