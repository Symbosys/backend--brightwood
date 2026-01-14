import express from "express";
import { createSchool, deleteSchool, getAllSchools, getSchoolById, updateSchool, getDashboardStats } from "../controller/school/School.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", createSchool);
router.get("/", getAllSchools);
router.get("/stats", protect, getDashboardStats);
router.get("/:id", getSchoolById);
router.put("/:id", updateSchool);
router.delete("/:id", deleteSchool);

export default router;  