import { asyncHandler } from "../../middleware/error.middleware.js";
import { createFeeStructureSchema, updateFeeStructureSchema } from "../../validation/FeeStructure.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode as status } from "../../types/types.js";
export const createFeeStructure = asyncHandler(async (req, res) => {
    const data = createFeeStructureSchema.parse(req.body);
    // Verify all related records exist
    const [feeType, academicYear, schoolClass, school] = await Promise.all([
        prisma.feeType.findUnique({ where: { id: data.feeTypeId } }),
        prisma.academicYear.findUnique({ where: { id: data.academicYearId } }),
        prisma.class.findUnique({ where: { id: data.classId } }),
        prisma.school.findUnique({ where: { id: data.schoolId } })
    ]);
    if (!feeType)
        throw new ErrorResponse("Fee Type not found", status.Not_Found);
    if (!academicYear)
        throw new ErrorResponse("Academic Year not found", status.Not_Found);
    if (!schoolClass)
        throw new ErrorResponse("Class not found", status.Not_Found);
    if (!school)
        throw new ErrorResponse("School not found", status.Not_Found);
    // Optional: Check if a structure for this specific combination already exists
    const existingStructure = await prisma.feeStructure.findFirst({
        where: {
            feeTypeId: data.feeTypeId,
            academicYearId: data.academicYearId,
            classId: data.classId,
            schoolId: data.schoolId
        }
    });
    if (existingStructure) {
        throw new ErrorResponse("A fee structure already exists for this class and academic year", status.Conflict);
    }
    const feeStructure = await prisma.feeStructure.create({
        data,
        include: {
            feeType: { select: { name: true } },
            class: { select: { name: true } },
            academicYear: { select: { name: true } }
        }
    });
    SuccessResponse(res, "Fee Structure created successfully", feeStructure, status.Created);
});
export const getAllFeeStructures = asyncHandler(async (req, res) => {
    const { schoolId, academicYearId, classId, feeTypeId, page = 1, limit = 10 } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const where = {};
    if (schoolId)
        where.schoolId = String(schoolId);
    if (academicYearId)
        where.academicYearId = String(academicYearId);
    if (classId)
        where.classId = String(classId);
    if (feeTypeId)
        where.feeTypeId = String(feeTypeId);
    const [feeStructures, total] = await Promise.all([
        prisma.feeStructure.findMany({
            where,
            skip,
            take: limitNumber,
            include: {
                feeType: { select: { name: true } },
                class: { select: { name: true } },
                academicYear: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.feeStructure.count({ where })
    ]);
    SuccessResponse(res, "Fee Structures fetched successfully", {
        feeStructures,
        meta: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber)
        }
    }, status.OK);
});
export const getFeeStructureById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const feeStructure = await prisma.feeStructure.findUnique({
        where: { id },
        include: {
            feeType: true,
            class: true,
            academicYear: true,
            _count: { select: { studentFees: true } }
        }
    });
    if (!feeStructure) {
        throw new ErrorResponse("Fee Structure not found", status.Not_Found);
    }
    SuccessResponse(res, "Fee Structure fetched successfully", feeStructure, status.OK);
});
export const updateFeeStructure = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = updateFeeStructureSchema.parse(req.body);
    const existing = await prisma.feeStructure.findUnique({ where: { id } });
    if (!existing)
        throw new ErrorResponse("Fee Structure not found", status.Not_Found);
    const updated = await prisma.feeStructure.update({
        where: { id },
        data,
        include: {
            feeType: { select: { name: true } },
            class: { select: { name: true } },
            academicYear: { select: { name: true } }
        }
    });
    SuccessResponse(res, "Fee Structure updated successfully", updated, status.OK);
});
export const deleteFeeStructure = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const feeStructure = await prisma.feeStructure.findUnique({
        where: { id },
        include: { _count: { select: { studentFees: true } } }
    });
    if (!feeStructure) {
        throw new ErrorResponse("Fee Structure not found", status.Not_Found);
    }
    if (feeStructure._count.studentFees > 0) {
        throw new ErrorResponse("Cannot delete fee structure as it has already been assigned to students", status.Bad_Request);
    }
    await prisma.feeStructure.delete({ where: { id } });
    SuccessResponse(res, "Fee Structure deleted successfully", null, status.OK);
});
//# sourceMappingURL=FeeStructure.controller.js.map