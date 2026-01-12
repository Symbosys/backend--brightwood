import { asyncHandler } from "../../middleware/error.middleware.js";
import { parentLoginSchema } from "../../validation/UserAuth.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";
import { JWT } from "../../utils/jwt.utils.js";
/**
 * @desc    Parent Login - Modified for ID-only access
 * @route   POST /api/v1/parent/login
 * @access  Public
 */
export const parentLogin = asyncHandler(async (req, res) => {
    // Log incoming request for debugging
    console.log('[Parent Login] Request body:', JSON.stringify(req.body, null, 2));
    // 1. Validate request body
    // NOTE: If your Zod schema (parentLoginSchema) requires a password string, 
    // ensure it allows an empty string since the frontend sends: password: ""
    let validatedData;
    try {
        validatedData = parentLoginSchema.parse(req.body);
    }
    catch (error) {
        console.error('[Parent Login] Validation error:', error);
        throw new ErrorResponse("Validation Error: Invalid request data", statusCode.Bad_Request);
    }
    const { parentsLoginId } = validatedData;
    console.log(`[Parent Login] Attempting login for ID: ${parentsLoginId}`);
    // 2. Find parent by parentsLoginId with children data
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
    // 3. Check if parent exists
    if (!parent) {
        console.log(`[Parent Login] Parent not found: ${parentsLoginId}`);
        throw new ErrorResponse("Invalid credentials: Parent ID not found", statusCode.Unauthorized);
    }
    console.log(`[Parent Login] Parent found: ${parent.firstName} ${parent.lastName}`);
    // 4. Verification logic
    // We are skipping bcrypt.compare(password, parent.password) 
    // because the requirement is to login using ONLY the Parent ID.
    console.log('[Parent Login] ID verified. Proceeding to generate token...');
    // 5. Generate JWT token
    const token = JWT.generateToken({
        id: parent.id,
        role: "PARENT",
    });
    console.log('[Parent Login] Token generated successfully');
    // 6. Remove password field from the database object before sending to frontend
    const { password: _, ...parentData } = parent;
    // 7. Send success response
    SuccessResponse(res, "Login successful", {
        user: parentData,
        role: "PARENT",
        token
    }, statusCode.OK);
    console.log(`[Parent Login] Login successful for: ${parentsLoginId}`);
});
//# sourceMappingURL=ParentAuth.controller.js.map