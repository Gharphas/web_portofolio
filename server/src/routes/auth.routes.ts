import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema, changePasswordSchema } from "../validators/schema";

const router = Router();

router.post("/login", validate(loginSchema), AuthController.login);
router.post("/logout", requireAuth, AuthController.logout);
router.get("/me", requireAuth, AuthController.getMe);
router.put("/profile", requireAuth, AuthController.updateProfile);
router.post("/change-password", requireAuth, validate(changePasswordSchema), AuthController.changePassword);
router.post("/change-email", requireAuth, AuthController.changeEmail);
router.post("/refresh", AuthController.refresh);

export default router;
