import { Router } from "express";
import { PhotosController } from "../controllers/photos.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { photoSchema } from "../validators/schema";

const router = Router();

router.get("/", PhotosController.getAll);
router.get("/:id", PhotosController.getById);
router.post("/", requireAuth, validate(photoSchema), PhotosController.create);
router.put("/:id", requireAuth, validate(photoSchema), PhotosController.update);
router.delete("/:id", requireAuth, PhotosController.delete);

export default router;
