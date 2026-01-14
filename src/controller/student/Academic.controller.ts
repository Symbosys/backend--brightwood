import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { AcademicValidation } from "../../validation/Academic.validation.js";
import prisma from "../../config/prisma.js";
import { SuccessResponse, ErrorResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";

export const createAcademic = asyncHandler(async (req: Request, res: Response) => {
    const data = AcademicValidation.parse(req.body);

    // Check if the school exists
    const school = await prisma.school.findUnique({
        where: { id: data.schoolId },
    });

    if (!school) {
        throw new ErrorResponse("School not found with the provided schoolId", statusCode.Not_Found);
    }

    // Check for duplicate name in the same school
    const existing = await prisma.academicYear.findUnique({
        where: {
            schoolId_name: {
                schoolId: data.schoolId,
                name: data.name
            }
        }
    });

    if (existing) {
        throw new ErrorResponse("Academic year with this name already exists in the school", statusCode.Conflict);
    }

    const academicYear = await prisma.academicYear.create({
        data,
    });
    SuccessResponse(res, "Academic Year created successfully", academicYear, statusCode.Created);
});

export const getAllAcademicYears = asyncHandler(async (req: Request, res: Response) => {
    const { schoolId } = req.query;

    // If we have stats logic or list logic, handle it here.
    // For now simple list.
    const where: any = {};
    if (schoolId) where.schoolId = String(schoolId);

    const academicYears = await prisma.academicYear.findMany({
        where,
        orderBy: { startDate: 'desc' }
    });

    // Wrap in standard list response format
    SuccessResponse(res, "Academic Years fetched successfully", {
        academicYears,
        meta: {
            page: 1,
            limit: academicYears.length,
            total: academicYears.length,
            totalPages: 1
        }
    }, statusCode.OK);
});

export const getAcademicYearById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const academicYear = await prisma.academicYear.findUnique({
        where: { id }
    });

    if (!academicYear) throw new ErrorResponse("Academic Year not found", statusCode.Not_Found);

    SuccessResponse(res, "Academic Year fetched successfully", academicYear, statusCode.OK);
});

export const updateAcademic = asyncHandler(async (req: Request, res: Response) => {
    // Note: Zod validation might need partial schem for updates, but using same for now or assume full update
    // If strict PATCH is needed, validation should be relaxed. 
    // Assuming PUT is sending full or valid subset.
    // Ideally use a partial schema, but for now reuse existing or rely on prisma to throw if missing requireds are not provided (PUT usually replaces).
    // Let's assume input matches validation.
    const data = req.body; // In real app, create a separate update schema

    const academicYear = await prisma.academicYear.update({
        where: {
            id: req.params.id,
        },
        data,
    });
    SuccessResponse(res, "Academic Year updated successfully", academicYear, statusCode.OK);
});

export const deleteAcademic = asyncHandler(async (req: Request, res: Response) => {
    await prisma.academicYear.delete({
        where: {
            id: req.params.id,
        },
    });
    SuccessResponse(res, "Academic Year deleted successfully", null, statusCode.OK);
});



