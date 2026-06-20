import { Router } from "express";
import { EducationController } from "../controllers/education.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { educationSchema } from "../validators/schema";

const router = Router();

router.get("/", EducationController.getAll);
router.get("/:id", EducationController.getById);
router.post("/", requireAuth, validate(educationSchema), EducationController.create);
router.put("/:id", requireAuth, validate(educationSchema), EducationController.update);
router.delete("/:id", requireAuth, EducationController.delete);

export default router;
