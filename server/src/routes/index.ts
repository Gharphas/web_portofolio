import { Router } from "express";
import authRoutes from "./auth.routes";
import aboutRoutes from "./about.routes";
import skillsRoutes from "./skills.routes";
import projectsRoutes from "./projects.routes";
import experienceRoutes from "./experience.routes";
import educationRoutes from "./education.routes";
import hobbiesRoutes from "./hobbies.routes";
import photosRoutes from "./photos.routes";
import contactRoutes from "./contact.routes";
import settingsRoutes from "./settings.routes";
import uploadRoutes from "./upload.routes";
import socialsRoutes from "./socials.routes";
import achievementsRoutes from "./achievements.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/about", aboutRoutes);
router.use("/skills", skillsRoutes);
router.use("/projects", projectsRoutes);
router.use("/experience", experienceRoutes);
router.use("/education", educationRoutes);
router.use("/hobbies", hobbiesRoutes);
router.use("/photos", photosRoutes);
router.use("/contact", contactRoutes);
router.use("/settings", settingsRoutes);
router.use("/upload", uploadRoutes);
router.use("/social-links", socialsRoutes);
router.use("/achievements", achievementsRoutes);

export default router;
