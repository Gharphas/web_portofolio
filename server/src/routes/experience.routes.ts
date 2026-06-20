import { Router } from "express";
import { ExperienceController } from "../controllers/experience.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { experienceSchema } from "../validators/schema";

const router = Router();

router.get("/", ExperienceController.getAll);
router.get("/:id", ExperienceController.getById);
router.post("/", requireAuth, validate(experienceSchema), ExperienceController.create);
router.put("/:id", requireAuth, validate(experienceSchema), ExperienceController.update);
router.delete("/:id", requireAuth, ExperienceController.delete);

export default router;
