import { Router } from "express";
import {
    loginAdmin,
    registerAdmin,
    getMe,
    changePassword,
    logoutAdmin,
    getAllAdmins,
    updateAdminStatus,
} from "../controller/auth/auth.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/login", loginAdmin);

// Protected routes (require authentication)
router.get("/me", protect, getMe);
router.put("/change-password", protect, changePassword);
router.post("/logout", protect, logoutAdmin);

// Super admin only routes
router.post("/register", registerAdmin);
router.get("/admins", protect, authorize("super_admin"), getAllAdmins);
router.put("/admins/:id/status", protect, authorize("super_admin"), updateAdminStatus);

export default router;
