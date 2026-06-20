import { Router } from "express";
import { SkillsController } from "../controllers/skills.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { skillSchema, skillReorderSchema } from "../validators/schema";

const router = Router();

router.get("/", SkillsController.getAll);
router.get("/:id", SkillsController.getById);
router.post("/", requireAuth, validate(skillSchema), SkillsController.create);
router.put("/reorder", requireAuth, validate(skillReorderSchema), SkillsController.reorder);
router.put("/:id", requireAuth, validate(skillSchema), SkillsController.update);
router.delete("/:id", requireAuth, SkillsController.delete);

export default router;
