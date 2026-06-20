import { Router } from "express";
import { AboutController } from "../controllers/about.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { aboutSchema } from "../validators/schema";

const router = Router();

router.get("/", AboutController.get);
router.put("/", requireAuth, validate(aboutSchema), AboutController.update);

export default router;
