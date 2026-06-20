import { Request, Response, NextFunction } from "express";
import { AboutService } from "../services/about.service";
import { RevalidateService } from "../services/revalidate.service";

export class AboutController {
  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AboutService.get();
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
      const data = await AboutService.update(req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");
      RevalidateService.triggerRevalidate("/about");

      res.status(200).json({
        success: true,
        message: "Informasi biography berhasil diperbarui",
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}
