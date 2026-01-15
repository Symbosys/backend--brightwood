import { asyncHandler } from "../../middleware/error.middleware.js";
import { AcademicValidation } from "../../validation/Academic.validation.js";
import prisma from "../../config/prisma.js";
import { SuccessResponse, ErrorResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";
export const createAcademic = asyncHandler(async (req, res) => {
    // Validate request body
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
export const getAllAcademicYears = asyncHandler(async (req, res) => {
    const { schoolId } = req.query;
    const where = {};
    if (schoolId)
        where.schoolId = String(schoolId);
    const academicYears = await prisma.academicYear.findMany({
        where,
        orderBy: { startDate: 'desc' }
    });
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
export const getAcademicYearById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const academicYear = await prisma.academicYear.findUnique({
        where: { id }
    });
    if (!academicYear)
        throw new ErrorResponse("Academic Year not found", statusCode.Not_Found);
    SuccessResponse(res, "Academic Year fetched successfully", academicYear, statusCode.OK);
});
export const updateAcademic = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Validate update data (partial allowed for updates generally, but we want to validate types)
    // Using partial validation since client might send only changed fields, 
    // though the frontend currently sends all fields.
    const data = AcademicValidation.partial().parse(req.body);
    // Check existence
    const existingYear = await prisma.academicYear.findUnique({
        where: { id },
    });
    if (!existingYear) {
        throw new ErrorResponse("Academic Year not found", statusCode.Not_Found);
    }
    // Check for duplicate name if name is being updated
    if (data.name && data.name !== existingYear.name) {
        // We use existingYear.schoolId because schoolId typically doesn't change, 
        // but if data.schoolId is provided, use that.
        const schoolIdToCheck = data.schoolId || existingYear.schoolId;
        const duplicate = await prisma.academicYear.findUnique({
            where: {
                schoolId_name: {
                    schoolId: schoolIdToCheck,
                    name: data.name
                }
            }
        });
        if (duplicate) {
            throw new ErrorResponse("Academic year with this name already exists in the school", statusCode.Conflict);
        }
    }
    const academicYear = await prisma.academicYear.update({
        where: { id },
        data,
    });
    SuccessResponse(res, "Academic Year updated successfully", academicYear, statusCode.OK);
});
export const deleteAcademic = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Check existence
    const existing = await prisma.academicYear.findUnique({ where: { id } });
    if (!existing) {
        throw new ErrorResponse("Academic Year not found", statusCode.Not_Found);
    }
    await prisma.academicYear.delete({
        where: { id },
    });
    SuccessResponse(res, "Academic Year deleted successfully", null, statusCode.OK);
});
//# sourceMappingURL=Academic.controller.js.map