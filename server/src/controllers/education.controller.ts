import { Request, Response, NextFunction } from "express";
import { EducationService } from "../services/education.service";
import { RevalidateService } from "../services/revalidate.service";

export class EducationController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await EducationService.getAll();
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
      const data = await EducationService.getById(req.params.id);
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
      const data = await EducationService.create(req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/experience");

      res.status(201).json({
        success: true,
        message: "Riwayat pendidikan baru berhasil ditambahkan",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await EducationService.update(req.params.id, req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/experience");

      res.status(200).json({
        success: true,
        message: "Riwayat pendidikan berhasil diperbarui",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await EducationService.delete(req.params.id);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/experience");

      res.status(200).json({
        success: true,
        message: "Riwayat pendidikan berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  }
}
