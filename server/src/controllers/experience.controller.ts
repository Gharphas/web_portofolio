import { Request, Response, NextFunction } from "express";
import { ExperienceService } from "../services/experience.service";
import { RevalidateService } from "../services/revalidate.service";

export class ExperienceController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ExperienceService.getAll();
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
      const data = await ExperienceService.getById(req.params.id);
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
      const data = await ExperienceService.create(req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");
      RevalidateService.triggerRevalidate("/experience");

      res.status(201).json({
        success: true,
        message: "Pengalaman baru berhasil ditambahkan",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ExperienceService.update(req.params.id, req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");
      RevalidateService.triggerRevalidate("/experience");

      res.status(200).json({
        success: true,
        message: "Pengalaman berhasil diperbarui",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await ExperienceService.delete(req.params.id);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");
      RevalidateService.triggerRevalidate("/experience");

      res.status(200).json({
        success: true,
        message: "Pengalaman berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  }
}
