import { Router } from "express";
import { ContactController } from "../controllers/contact.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { contactRateLimiter } from "../middleware/rateLimiter";
import { contactMessageSchema } from "../validators/schema";

const router = Router();

router.post("/send", contactRateLimiter, validate(contactMessageSchema), ContactController.sendMessage);
router.get("/messages", requireAuth, ContactController.getAllMessages);
router.put("/messages/:id/read", requireAuth, ContactController.markAsRead);
router.put("/messages/:id/star", requireAuth, ContactController.toggleStar);
router.delete("/messages/:id", requireAuth, ContactController.deleteMessage);

export default router;
