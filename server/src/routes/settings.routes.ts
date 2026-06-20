import { Router } from "express";
import { SettingsController } from "../controllers/settings.controller";
import { requireAuth } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { settingSchema, bulkSettingsSchema } from "../validators/schema";

const router = Router();

router.get("/", SettingsController.getAll);
router.get("/:key", SettingsController.getByKey);
router.put("/bulk", requireAuth, validate(bulkSettingsSchema), SettingsController.bulkUpdate);
router.put("/:key", requireAuth, validate(settingSchema), SettingsController.update);

export default router;
