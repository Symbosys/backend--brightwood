import type { Request, Response, NextFunction } from "express";
import { JWT } from "../utils/jwt.utils.js";
import { ErrorResponse } from "../utils/response.util.js";
import { statusCode } from "../types/types.js";
import prisma from "../config/prisma.js";

// Extend Request type to include admin
declare global {
    namespace Express {
        interface Request {
            admin?: {
                id: string;
                email: string;
                role: string;
                schoolId: string;
            };
        }
    }
}

// Protect routes - verify JWT token
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return next(new ErrorResponse("Not authorized to access this route", statusCode.Unauthorized));
    }

    try {
        // Verify token
        const decoded = JWT.verifyToken(token) as {
            id: string;
            email: string;
            role: string;
            schoolId: string;
        };

        if (!decoded || typeof decoded === 'string' || decoded instanceof Error) {
            return next(new ErrorResponse("Not authorized to access this route", statusCode.Unauthorized));
        }

        // Check if admin still exists and is active
        const admin = await prisma.admin.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                role: true,
                schoolId: true,
                isActive: true,
            }
        });

        if (!admin) {
            return next(new ErrorResponse("Admin not found", statusCode.Unauthorized));
        }

        if (!admin.isActive) {
            return next(new ErrorResponse("Your account has been deactivated", statusCode.Forbidden));
        }

        // Attach admin to request
        req.admin = {
            id: admin.id,
            email: admin.email,
            role: admin.role,
            schoolId: admin.schoolId,
        };

        next();
    } catch (error) {
        return next(new ErrorResponse("Not authorized to access this route", statusCode.Unauthorized));
    }
};

// Authorize by role
export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.admin) {
            return next(new ErrorResponse("Not authorized to access this route", statusCode.Unauthorized));
        }

        if (!roles.includes(req.admin.role)) {
            return next(new ErrorResponse(`Role '${req.admin.role}' is not authorized to access this route`, statusCode.Forbidden));
        }

        next();
    };
};
