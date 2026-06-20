import { Request, Response, NextFunction } from "express";
import { SettingsService } from "../services/settings.service";
import { RevalidateService } from "../services/revalidate.service";

export class SettingsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.getAll();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getByKey(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await SettingsService.getByKey(req.params.key);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { value, category } = req.body;
      const data = await SettingsService.update(req.params.key, value, category);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");
      RevalidateService.triggerRevalidate("/about");
      RevalidateService.triggerRevalidate("/experience");
      RevalidateService.triggerRevalidate("/projects");
      RevalidateService.triggerRevalidate("/contact");

      res.status(200).json({
        success: true,
        message: "Pengaturan berhasil diperbarui",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async bulkUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const { settings } = req.body;
      if (!Array.isArray(settings) || settings.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "Array pengaturan tidak boleh kosong",
          },
        });
      }
      await SettingsService.bulkUpdate(settings);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");
      RevalidateService.triggerRevalidate("/about");
      RevalidateService.triggerRevalidate("/experience");
      RevalidateService.triggerRevalidate("/projects");
      RevalidateService.triggerRevalidate("/contact");

      res.status(200).json({
        success: true,
        message: "Semua pengaturan berhasil diperbarui",
      });
    } catch (err) {
      next(err);
    }
  }
}
