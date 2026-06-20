import { Router } from "express";
import { AchievementsController } from "../controllers/achievements.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { achievementSchema } from "../validators/schema";

const router = Router();

router.get("/", AchievementsController.getAll);
router.get("/:id", AchievementsController.getById);

router.post("/", requireAuth, validate(achievementSchema), AchievementsController.create);
router.put("/:id", requireAuth, validate(achievementSchema), AchievementsController.update);
router.delete("/:id", requireAuth, AchievementsController.delete);

export default router;
