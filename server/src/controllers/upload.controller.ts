import { Request, Response, NextFunction } from "express";
import { UploadService } from "../services/upload.service";

export class UploadController {
  static async uploadSingle(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file;
      const bucket = req.body.bucket || req.query.bucket || "photos";
      const folder = req.body.folder || req.query.folder || "";

      if (!file) {
        return res.status(400).json({
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "File wajib disertakan dalam request",
          },
        });
      }

      const data = await UploadService.uploadFile(bucket, file, folder);

      res.status(200).json({
        success: true,
        message: "File berhasil diunggah",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async uploadMultiple(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      const bucket = req.body.bucket || req.query.bucket || "photos";
      const folder = req.body.folder || req.query.folder || "";

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "File wajib disertakan dalam request",
          },
        });
      }

      const uploadPromises = files.map((file) =>
        UploadService.uploadFile(bucket, file, folder)
      );

      const data = await Promise.all(uploadPromises);

      res.status(200).json({
        success: true,
        message: `${files.length} file berhasil diunggah`,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { bucket, path } = req.params;
      if (!bucket || !path) {
        return res.status(400).json({
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "Bucket dan path file wajib disertakan",
          },
        });
      }

      await UploadService.deleteFile(bucket, path);

      res.status(200).json({
        success: true,
        message: "File berhasil dihapus dari penyimpanan",
      });
    } catch (err) {
      next(err);
    }
  }
}
