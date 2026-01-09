import { asyncHandler } from "../../middleware/error.middleware.js";
import { createFeeTypeSchema, updateFeeTypeSchema } from "../../validation/FeeType.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode as status } from "../../types/types.js";
export const createFeeType = asyncHandler(async (req, res) => {
    const data = createFeeTypeSchema.parse(req.body);
    // Check if school exists
    const school = await prisma.school.findUnique({
        where: { id: data.schoolId }
    });
    if (!school) {
        throw new ErrorResponse("School not found", status.Not_Found);
    }
    // Check for duplicate name in the same school
    const existingFeeType = await prisma.feeType.findUnique({
        where: {
            schoolId_name: {
                schoolId: data.schoolId,
                name: data.name
            }
        }
    });
    if (existingFeeType) {
        throw new ErrorResponse("Fee Type with this name already exists in this school", status.Conflict);
    }
    const feeType = await prisma.feeType.create({
        data
    });
    SuccessResponse(res, "Fee Type created successfully", feeType, status.Created);
});
export const getAllFeeTypes = asyncHandler(async (req, res) => {
    const { schoolId, search, page = 1, limit = 10 } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const where = {};
    if (schoolId)
        where.schoolId = String(schoolId);
    if (search) {
        where.name = { contains: String(search) };
    }
    const [feeTypes, total] = await Promise.all([
        prisma.feeType.findMany({
            where,
            skip,
            take: limitNumber,
            orderBy: { name: 'asc' }
        }),
        prisma.feeType.count({ where })
    ]);
    SuccessResponse(res, "Fee Types fetched successfully", {
        feeTypes,
        meta: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber)
        }
    }, status.OK);
});
export const getFeeTypeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const feeType = await prisma.feeType.findUnique({
        where: { id },
        include: {
            _count: {
                select: { structures: true }
            }
        }
    });
    if (!feeType) {
        throw new ErrorResponse("Fee Type not found", status.Not_Found);
    }
    SuccessResponse(res, "Fee Type fetched successfully", feeType, status.OK);
});
export const updateFeeType = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = updateFeeTypeSchema.parse(req.body);
    const feeType = await prisma.feeType.findUnique({
        where: { id }
    });
    if (!feeType) {
        throw new ErrorResponse("Fee Type not found", status.Not_Found);
    }
    // If name is being updated, check for duplicates
    if (data.name && data.name !== feeType.name) {
        const existing = await prisma.feeType.findUnique({
            where: {
                schoolId_name: {
                    schoolId: feeType.schoolId,
                    name: data.name
                }
            }
        });
        if (existing) {
            throw new ErrorResponse("Another Fee Type with this name already exists in this school", status.Conflict);
        }
    }
    const updatedFeeType = await prisma.feeType.update({
        where: { id },
        data
    });
    SuccessResponse(res, "Fee Type updated successfully", updatedFeeType, status.OK);
});
export const deleteFeeType = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const feeType = await prisma.feeType.findUnique({
        where: { id },
        include: {
            _count: {
                select: { structures: true }
            }
        }
    });
    if (!feeType) {
        throw new ErrorResponse("Fee Type not found", status.Not_Found);
    }
    if (feeType._count.structures > 0) {
        throw new ErrorResponse("Cannot delete Fee Type because it is used in Fee Structures", status.Bad_Request);
    }
    await prisma.feeType.delete({
        where: { id }
    });
    SuccessResponse(res, "Fee Type deleted successfully", null, status.OK);
});
//# sourceMappingURL=FeeType.controller.js.map