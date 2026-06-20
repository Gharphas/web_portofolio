import { Request, Response, NextFunction } from "express";
import { ContactService } from "../services/contact.service";

export class ContactController {
  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ContactService.sendMessage(req.body);
      res.status(201).json({
        success: true,
        message: "Pesan Anda berhasil dikirim",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAllMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ContactService.getAllMessages();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const isRead = req.body.isRead === true;
      const data = await ContactService.markAsRead(req.params.id, isRead);
      res.status(200).json({
        success: true,
        message: isRead ? "Pesan ditandai sebagai dibaca" : "Pesan ditandai sebagai belum dibaca",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async toggleStar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ContactService.toggleStar(req.params.id);
      res.status(200).json({
        success: true,
        message: data.is_starred ? "Pesan dibintangi" : "Pesan batal dibintangi",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteMessage(req: Request, res: Response, next: NextFunction) {
    try {
      await ContactService.deleteMessage(req.params.id);
      res.status(200).json({
        success: true,
        message: "Pesan berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  }
}
