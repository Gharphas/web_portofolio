import { Request, Response, NextFunction } from "express";
import { SocialsService } from "../services/socials.service";
import { RevalidateService } from "../services/revalidate.service";

export class SocialsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SocialsService.getAll();
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
      const data = await SocialsService.getById(req.params.id);
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
      const data = await SocialsService.create(req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");
      RevalidateService.triggerRevalidate("/about");
      RevalidateService.triggerRevalidate("/experience");
      RevalidateService.triggerRevalidate("/projects");
      RevalidateService.triggerRevalidate("/contact");

      res.status(201).json({
        success: true,
        message: "Tautan sosial baru berhasil ditambahkan",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SocialsService.update(req.params.id, req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");
      RevalidateService.triggerRevalidate("/about");
      RevalidateService.triggerRevalidate("/experience");
      RevalidateService.triggerRevalidate("/projects");
      RevalidateService.triggerRevalidate("/contact");

      res.status(200).json({
        success: true,
        message: "Tautan sosial berhasil diperbarui",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await SocialsService.delete(req.params.id);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");
      RevalidateService.triggerRevalidate("/about");
      RevalidateService.triggerRevalidate("/experience");
      RevalidateService.triggerRevalidate("/projects");
      RevalidateService.triggerRevalidate("/contact");

      res.status(200).json({
        success: true,
        message: "Tautan sosial berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  }
}
