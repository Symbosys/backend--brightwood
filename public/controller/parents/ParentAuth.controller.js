import { asyncHandler } from "../../middleware/error.middleware.js";
import { parentLoginSchema } from "../../validation/UserAuth.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";
import bcrypt from "bcryptjs";
import { JWT } from "../../utils/jwt.utils.js";
/**
 * @desc    Parent Login
 * @route   POST /api/v1/parent/login
 * @access  Public
 */
export const parentLogin = asyncHandler(async (req, res) => {
    const { parentsLoginId, password } = parentLoginSchema.parse(req.body);
    const parent = await prisma.parent.findUnique({
        where: { parentsLoginId },
        include: {
            children: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    schoolId: true,
                    dateOfBirth: true
                }
            }
        }
    });
    if (!parent) {
        throw new ErrorResponse("Invalid credentials", statusCode.Unauthorized);
    }
    let loginWarning = null;
    // Check if password exists
    if (!parent.password) {
        // Fallback: Check if the provided password matches any child's date of birth (DDMMYYYY)
        const matchedChild = parent.children.find(child => {
            if (!child.dateOfBirth)
                return false;
            const d = child.dateOfBirth;
            const day = String(d.getUTCDate()).padStart(2, '0');
            const month = String(d.getUTCMonth() + 1).padStart(2, '0');
            const year = d.getUTCFullYear();
            const dobString = `${day}${month}${year}`;
            console.log(`[Parent Login Debug] Child: ${child.firstName}, Received: ${password}, Expected: ${dobString}`);
            return password === dobString;
        });
        if (!matchedChild) {
            throw new ErrorResponse("Account not setup. Please use your child's Date of Birth (DDMMYYYY) or contact admin.", statusCode.Unauthorized);
        }
        loginWarning = "Security Warning: You are using a default password. Please update your password immediately.";
    }
    else {
        // Compare hashed password
        const isMatch = await bcrypt.compare(password, parent.password);
        if (!isMatch) {
            throw new ErrorResponse("Invalid credentials", statusCode.Unauthorized);
        }
    }
    const token = JWT.generateToken({
        id: parent.id,
        role: "PARENT",
    });
    const { password: _, ...parentData } = parent;
    SuccessResponse(res, "Login successful", {
        user: parentData,
        role: "PARENT",
        token,
        warning: loginWarning
    }, statusCode.OK);
});
//# sourceMappingURL=ParentAuth.controller.js.map