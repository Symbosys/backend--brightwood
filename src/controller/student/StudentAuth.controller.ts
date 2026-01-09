import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { studentLoginSchema } from "../../validation/StudentAuth.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";
import bcrypt from "bcryptjs";
import { JWT } from "../../utils/jwt.utils.js";

/**
 * @desc    Student Login
 * @route   POST /api/v1/student/login
 * @access  Public
 */
export const studentLogin = asyncHandler(async (req: Request, res: Response) => {
    const { loginId, password } = studentLoginSchema.parse(req.body);

    // Find student by loginId
    const student = await prisma.student.findUnique({
        where: { loginId },
        include: {
            school: {
                select: { name: true }
            }
        }
    });

    if (!student) {
        throw new ErrorResponse("Invalid credentials", statusCode.Unauthorized);
    }

    let loginWarning = null;

    // Check if password exists
    if (!student.password) {
        // Fallback: Check if the provided password matches the student's date of birth (DDMMYYYY)
        if (!student.dateOfBirth) {
            throw new ErrorResponse("Account not setup and no DOB found. Contact admin.", statusCode.Unauthorized);
        }

        const d = student.dateOfBirth;
        const day = String(d.getUTCDate()).padStart(2, '0');
        const month = String(d.getUTCMonth() + 1).padStart(2, '0');
        const year = d.getUTCFullYear();
        const dobString = `${day}${month}${year}`;

        console.log(`[Login Debug] ID: ${loginId}, Received: ${password}, Expected (DOB): ${dobString}`);

        if (password !== dobString) {
            throw new ErrorResponse("Invalid credentials. Use your DOB (DDMMYYYY) as password.", statusCode.Unauthorized);
        }

        loginWarning = "Security Warning: No password set. Please update it immediately.";
    } else {
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            throw new ErrorResponse("Invalid credentials", statusCode.Unauthorized);
        }
    }

    // Generate token
    const token = JWT.generateToken({
        id: student.id,
        role: "STUDENT",
        schoolId: student.schoolId
    });

    // Remove password from response
    const { password: _, ...studentData } = student;

    SuccessResponse(res, "Login successful", {
        student: studentData,
        token,
        warning: loginWarning
    }, statusCode.OK);
});
