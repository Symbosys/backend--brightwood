import type { Request, Response } from "express";
/**
 * @desc    Admin Login
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export declare const loginAdmin: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Register new Admin (Super Admin only)
 * @route   POST /api/v1/auth/register
 * @access  Private (Super Admin)
 */
export declare const registerAdmin: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get current logged in admin
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export declare const getMe: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Change admin password
 * @route   PUT /api/v1/auth/change-password
 * @access  Private
 */
export declare const changePassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Logout admin (client-side token removal)
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export declare const logoutAdmin: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get all admins (Super Admin only)
 * @route   GET /api/v1/auth/admins
 * @access  Private (Super Admin)
 */
export declare const getAllAdmins: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Update admin status (activate/deactivate)
 * @route   PUT /api/v1/auth/admins/:id/status
 * @access  Private (Super Admin)
 */
export declare const updateAdminStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=auth.controller.d.ts.map