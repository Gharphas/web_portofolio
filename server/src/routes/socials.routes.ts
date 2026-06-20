import { Router } from "express";
import { SocialsController } from "../controllers/socials.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { socialLinkSchema } from "../validators/schema";

const router = Router();

router.get("/", SocialsController.getAll);
router.get("/:id", SocialsController.getById);
router.post("/", requireAuth, validate(socialLinkSchema), SocialsController.create);
router.put("/:id", requireAuth, validate(socialLinkSchema), SocialsController.update);
router.delete("/:id", requireAuth, SocialsController.delete);

export default router;
