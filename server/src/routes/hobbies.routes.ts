import { Router } from "express";
import { HobbiesController } from "../controllers/hobbies.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { hobbySchema } from "../validators/schema";

const router = Router();

router.get("/", HobbiesController.getAll);
router.get("/:id", HobbiesController.getById);
router.post("/", requireAuth, validate(hobbySchema), HobbiesController.create);
router.put("/:id", requireAuth, validate(hobbySchema), HobbiesController.update);
router.delete("/:id", requireAuth, HobbiesController.delete);

export default router;
