import { Router } from "express";
import { UploadController } from "../controllers/upload.controller";
import { requireAuth } from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// PRD standard endpoints
router.post("/image", requireAuth, upload.single("file"), UploadController.uploadSingle);
router.post("/images", requireAuth, upload.array("files", 10), UploadController.uploadMultiple);
router.post("/document", requireAuth, upload.single("file"), UploadController.uploadSingle);

// Helper / robustness aliases
router.post("/", requireAuth, upload.single("file"), UploadController.uploadSingle);
router.post("/single", requireAuth, upload.single("file"), UploadController.uploadSingle);
router.post("/multiple", requireAuth, upload.array("files", 10), UploadController.uploadMultiple);

// Delete endpoint
router.delete("/:bucket/:path(*)", requireAuth, UploadController.deleteFile);

export default router;
