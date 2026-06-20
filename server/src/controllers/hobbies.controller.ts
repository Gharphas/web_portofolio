import { Request, Response, NextFunction } from "express";
import { HobbiesService } from "../services/hobbies.service";
import { RevalidateService } from "../services/revalidate.service";

export class HobbiesController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await HobbiesService.getAll();
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
      const data = await HobbiesService.getById(req.params.id);
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
      const data = await HobbiesService.create(req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");

      res.status(201).json({
        success: true,
        message: "Hobi baru berhasil ditambahkan",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await HobbiesService.update(req.params.id, req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");

      res.status(200).json({
        success: true,
        message: "Hobi berhasil diperbarui",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await HobbiesService.delete(req.params.id);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");

      res.status(200).json({
        success: true,
        message: "Hobi berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  }
}
