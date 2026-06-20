import { Request, Response, NextFunction } from "express";
import { ProjectsService } from "../services/projects.service";
import { RevalidateService } from "../services/revalidate.service";

export class ProjectsController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const category = req.query.category as string | undefined;
      const is_featured = req.query.is_featured === "true" ? true : req.query.is_featured === "false" ? false : undefined;

      const data = await ProjectsService.getAll({ category, is_featured });
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ProjectsService.getBySlug(req.params.slug);
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
      const data = await ProjectsService.create(req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");
      RevalidateService.triggerRevalidate("/projects");
      if (data && data.slug) {
        RevalidateService.triggerRevalidate(`/projects/${data.slug}`);
      }

      res.status(201).json({
        success: true,
        message: "Proyek baru berhasil ditambahkan",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ProjectsService.update(req.params.id, req.body);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");
      RevalidateService.triggerRevalidate("/projects");
      if (data && data.slug) {
        RevalidateService.triggerRevalidate(`/projects/${data.slug}`);
      }

      res.status(200).json({
        success: true,
        message: "Proyek berhasil diperbarui",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await ProjectsService.delete(req.params.id);
      
      // Trigger background page revalidation
      RevalidateService.triggerRevalidate("/");
      RevalidateService.triggerRevalidate("/projects");
      if (data && data.slug) {
        RevalidateService.triggerRevalidate(`/projects/${data.slug}`);
      }

      res.status(200).json({
        success: true,
        message: "Proyek berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  }

  static async addImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { images } = req.body;
      if (!Array.isArray(images) || images.length === 0) {
        return res.status(400).json({
          success: false,
          error: {
            code: "BAD_REQUEST",
            message: "Array gambar tidak boleh kosong",
          },
        });
      }
      const data = await ProjectsService.addImages(req.params.id, images);
      
      // Trigger background page revalidation for project detail page
      const project = await ProjectsService.getById(req.params.id);
      if (project && project.slug) {
        RevalidateService.triggerRevalidate(`/projects/${project.slug}`);
      }

      res.status(201).json({
        success: true,
        message: "Gambar proyek berhasil ditambahkan",
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      await ProjectsService.deleteImage(req.params.id, req.params.imgId);
      
      // Trigger background page revalidation for project detail page
      const project = await ProjectsService.getById(req.params.id);
      if (project && project.slug) {
        RevalidateService.triggerRevalidate(`/projects/${project.slug}`);
      }

      res.status(200).json({
        success: true,
        message: "Gambar proyek berhasil dihapus",
      });
    } catch (err) {
      next(err);
    }
  }
}
