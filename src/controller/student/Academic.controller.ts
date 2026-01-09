import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { AcademicValidation } from "../../validation/Academic.validation.js";
import prisma from "../../config/prisma.js";
import { SuccessResponse, ErrorResponse } from "../../utils/response.util.js";

export const createAcademic = asyncHandler(async (req: Request, res: Response) => {
    const data = AcademicValidation.parse(req.body);

    // Check if the school exists
    const school = await prisma.school.findUnique({
        where: { id: data.schoolId },
    });

    if (!school) {
        throw new ErrorResponse("School not found with the provided schoolId", 404);
    }

    const academicYear = await prisma.academicYear.create({
        data,
    });
    SuccessResponse(res, "Academic Year created successfully", academicYear, 201);
});

export const getAcademic = asyncHandler(async (req: Request, res: Response) => {
    const academicYear = await prisma.academicYear.findMany();
    SuccessResponse(res, "Academic Year fetched successfully", academicYear, 200);
});

export const updateAcademic = asyncHandler(async (req: Request, res: Response) => {
    const data = AcademicValidation.parse(req.body);
    const academicYear = await prisma.academicYear.update({
        where: {
            id: req.params.id,
        },
        data,
    });
    SuccessResponse(res, "Academic Year updated successfully", academicYear, 200);
});

export const deleteAcademic = asyncHandler(async (req: Request, res: Response) => {
    const academicYear = await prisma.academicYear.delete({
        where: {
            id: req.params.id,
        },
    });
    SuccessResponse(res, "Academic Year deleted successfully", academicYear, 200);
});



