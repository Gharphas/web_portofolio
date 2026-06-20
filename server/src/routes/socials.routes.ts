import { Router } from "express";
import { SocialsController } from "../controllers/socials.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";

// We don't necessarily need a strict Zod validator schema for social link updates since it is simple,
// but to be safe we can use request body parsing or leave it open to support generic payload structure.
// Zod schema for socials is simple, let's just use it or pass direct controller actions.
const router = Router();

router.get("/", SocialsController.getAll);
router.get("/:id", SocialsController.getById);
router.post("/", requireAuth, SocialsController.create);
router.put("/:id", requireAuth, SocialsController.update);
router.delete("/:id", requireAuth, SocialsController.delete);

export default router;
