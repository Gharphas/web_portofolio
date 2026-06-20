import { Router } from "express";
import { ProjectsController } from "../controllers/projects.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { projectSchema } from "../validators/schema";

const router = Router();

router.get("/", ProjectsController.getAll);
router.get("/:slug", ProjectsController.getBySlug);
router.post("/", requireAuth, validate(projectSchema), ProjectsController.create);
router.put("/:id", requireAuth, validate(projectSchema), ProjectsController.update);
router.delete("/:id", requireAuth, ProjectsController.delete);

// Project gallery sub-routes
router.post("/:id/images", requireAuth, ProjectsController.addImages);
router.delete("/:id/images/:imgId", requireAuth, ProjectsController.deleteImage);

export default router;
