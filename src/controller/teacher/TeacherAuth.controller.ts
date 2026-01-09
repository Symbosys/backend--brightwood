import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { teacherLoginSchema } from "../../validation/UserAuth.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";
import bcrypt from "bcryptjs";
import { JWT } from "../../utils/jwt.utils.js";

/**
 * @desc    Teacher Login
 * @route   POST /api/v1/teacher/login
 * @access  Public
 */
export const teacherLogin = asyncHandler(async (req: Request, res: Response) => {
    const { teacherLoginId, password } = teacherLoginSchema.parse(req.body);

    const teacher = await prisma.teacher.findUnique({
        where: { teacherLoginId },
        include: {
            school: { select: { name: true } }
        }
    });

    if (!teacher) {
        throw new ErrorResponse("Invalid credentials", statusCode.Unauthorized);
    }

    let loginWarning = null;
    // Check if password exists
    if (!teacher.password) {
        // Dev Mode: Allow any password if none is set in DB
        loginWarning = "Security Warning: No password set for this account. Please update your password immediately.";
    } else {
        // Compare hashed password
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            throw new ErrorResponse("Invalid credentials", statusCode.Unauthorized);
        }
    }

    const token = JWT.generateToken({
        id: teacher.id,
        role: "TEACHER",
        schoolId: teacher.schoolId
    });

    const { password: _, ...teacherData } = teacher;

    SuccessResponse(res, "Login successful", {
        user: teacherData,
        role: "TEACHER",
        token,
        warning: loginWarning
    }, statusCode.OK);
});
