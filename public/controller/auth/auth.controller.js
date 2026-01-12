import { asyncHandler } from "../../middleware/error.middleware.js";
import { loginSchema, registerAdminSchema, changePasswordSchema } from "../../validation/auth.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";
import bcrypt from "bcryptjs";
import { JWT } from "../../utils/jwt.utils.js";
/**
 * @desc    Admin Login
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);
    // Find admin by email
    const admin = await prisma.admin.findUnique({
        where: { email },
        include: {
            school: { select: { id: true, name: true } }
        }
    });
    if (!admin) {
        throw new ErrorResponse("Invalid credentials", statusCode.Unauthorized);
    }
    // Check if admin is active
    if (!admin.isActive) {
        throw new ErrorResponse("Your account has been deactivated. Please contact the administrator.", statusCode.Forbidden);
    }
    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        throw new ErrorResponse("Invalid credentials", statusCode.Unauthorized);
    }
    // Generate JWT token
    const token = JWT.generateToken({
        id: admin.id,
        email: admin.email,
        role: admin.role,
        schoolId: admin.schoolId
    });
    // Remove password from response
    const { password: _, ...adminData } = admin;
    SuccessResponse(res, "Login successful", {
        user: adminData,
        token
    }, statusCode.OK);
});
/**
 * @desc    Register new Admin (Super Admin only)
 * @route   POST /api/v1/auth/register
 * @access  Private (Super Admin)
 */
export const registerAdmin = asyncHandler(async (req, res) => {
    const validatedData = registerAdminSchema.parse(req.body);
    // Check if email already exists
    const existingAdmin = await prisma.admin.findUnique({
        where: { email: validatedData.email }
    });
    if (existingAdmin) {
        throw new ErrorResponse("Email already registered", statusCode.Conflict);
    }
    // Check if school exists
    const school = await prisma.school.findUnique({
        where: { id: validatedData.schoolId }
    });
    if (!school) {
        throw new ErrorResponse("School not found", statusCode.Not_Found);
    }
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);
    // Create admin
    const admin = await prisma.admin.create({
        data: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            password: hashedPassword,
            role: validatedData.role,
            schoolId: validatedData.schoolId
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            schoolId: true,
            createdAt: true,
            school: { select: { name: true } }
        }
    });
    SuccessResponse(res, "Admin registered successfully", admin, statusCode.Created);
});
/**
 * @desc    Get current logged in admin
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
    if (!req.admin) {
        throw new ErrorResponse("Not authorized", statusCode.Unauthorized);
    }
    const admin = await prisma.admin.findUnique({
        where: { id: req.admin.id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            schoolId: true,
            createdAt: true,
            updatedAt: true,
            school: { select: { id: true, name: true } }
        }
    });
    if (!admin) {
        throw new ErrorResponse("Admin not found", statusCode.Not_Found);
    }
    SuccessResponse(res, "Admin details retrieved successfully", admin, statusCode.OK);
});
/**
 * @desc    Change admin password
 * @route   PUT /api/v1/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
    if (!req.admin) {
        throw new ErrorResponse("Not authorized", statusCode.Unauthorized);
    }
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    // Get admin with password
    const admin = await prisma.admin.findUnique({
        where: { id: req.admin.id }
    });
    if (!admin) {
        throw new ErrorResponse("Admin not found", statusCode.Not_Found);
    }
    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
        throw new ErrorResponse("Current password is incorrect", statusCode.Bad_Request);
    }
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    // Update password
    await prisma.admin.update({
        where: { id: req.admin.id },
        data: { password: hashedPassword }
    });
    SuccessResponse(res, "Password changed successfully", {}, statusCode.OK);
});
/**
 * @desc    Logout admin (client-side token removal)
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logoutAdmin = asyncHandler(async (req, res) => {
    // Since we're using JWT, logout is handled client-side by removing the token
    // This endpoint is for API completeness and can be used for logging/auditing
    SuccessResponse(res, "Logged out successfully", {}, statusCode.OK);
});
/**
 * @desc    Get all admins (Super Admin only)
 * @route   GET /api/v1/auth/admins
 * @access  Private (Super Admin)
 */
export const getAllAdmins = asyncHandler(async (req, res) => {
    if (!req.admin) {
        throw new ErrorResponse("Not authorized", statusCode.Unauthorized);
    }
    const admins = await prisma.admin.findMany({
        where: { schoolId: req.admin.schoolId },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
    });
    SuccessResponse(res, "Admins retrieved successfully", admins, statusCode.OK);
});
/**
 * @desc    Update admin status (activate/deactivate)
 * @route   PUT /api/v1/auth/admins/:id/status
 * @access  Private (Super Admin)
 */
export const updateAdminStatus = asyncHandler(async (req, res) => {
    if (!req.admin) {
        throw new ErrorResponse("Not authorized", statusCode.Unauthorized);
    }
    const { id } = req.params;
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
        throw new ErrorResponse("isActive must be a boolean value", statusCode.Bad_Request);
    }
    // Check if admin exists and belongs to the same school
    const adminToUpdate = await prisma.admin.findFirst({
        where: {
            id,
            schoolId: req.admin.schoolId
        }
    });
    if (!adminToUpdate) {
        throw new ErrorResponse("Admin not found", statusCode.Not_Found);
    }
    // Prevent self-deactivation
    if (adminToUpdate.id === req.admin.id && !isActive) {
        throw new ErrorResponse("You cannot deactivate your own account", statusCode.Bad_Request);
    }
    // Update admin status
    const updatedAdmin = await prisma.admin.update({
        where: { id },
        data: { isActive },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            updatedAt: true
        }
    });
    const message = isActive ? "Admin activated successfully" : "Admin deactivated successfully";
    SuccessResponse(res, message, updatedAdmin, statusCode.OK);
});
//# sourceMappingURL=auth.controller.js.map