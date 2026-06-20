import { Request, Response, NextFunction } from "express";
import { PhotosService } from "../services/photos.service";
import { RevalidateService } from "../services/revalidate.service";

export class PhotosController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;
      const data = await PhotosService.getAll(category);
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
      const data = await PhotosService.getById(req.params.id);
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
      const data = await PhotosService.create(req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");

      res.status(201).json({
        success: true,
        message: "Foto baru berhasil ditambahkan",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await PhotosService.update(req.params.id, req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");

      res.status(200).json({
        success: true,
        message: "Foto berhasil diperbarui",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await PhotosService.delete(req.params.id);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");

      res.status(200).json({
        success: true,
        message: "Foto berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  }
}
