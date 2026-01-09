import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { createStudentFeeSchema, updateStudentFeeSchema } from "../../validation/StudentFee.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode as status } from "../../types/types.js";

export const assignFeeToStudent = asyncHandler(async (req: Request, res: Response) => {
    const data = createStudentFeeSchema.parse(req.body);

    // Verify student and fee structure exist
    const [student, feeStructure] = await Promise.all([
        prisma.student.findUnique({ where: { id: data.studentId } }),
        prisma.feeStructure.findUnique({ where: { id: data.feeStructureId } })
    ]);

    if (!student) throw new ErrorResponse("Student not found", status.Not_Found);
    if (!feeStructure) throw new ErrorResponse("Fee Structure not found", status.Not_Found);

    // If amount is not provided, use the amount from the fee structure
    const finalAmount = data.amount !== undefined ? data.amount : feeStructure.amount;

    // Check if this fee is already assigned to the student
    const existingFee = await prisma.studentFee.findFirst({
        where: {
            studentId: data.studentId,
            feeStructureId: data.feeStructureId
        }
    });

    if (existingFee) {
        throw new ErrorResponse("This fee has already been assigned to this student", status.Conflict);
    }

    const studentFee = await prisma.studentFee.create({
        data: {
            ...data,
            amount: finalAmount
        },
        include: {
            student: { select: { firstName: true, lastName: true } },
            feeStructure: {
                include: {
                    feeType: { select: { name: true } }
                }
            }
        }
    });

    SuccessResponse(res, "Fee assigned to student successfully", studentFee, status.Created);
});

export const getStudentFees = asyncHandler(async (req: Request, res: Response) => {
    const { studentId, status: feeStatus, page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};
    if (studentId) where.studentId = String(studentId);
    if (feeStatus) where.status = String(feeStatus);

    const [studentFees, total] = await Promise.all([
        prisma.studentFee.findMany({
            where,
            skip,
            take: limitNumber,
            include: {
                student: { select: { firstName: true, lastName: true } },
                feeStructure: {
                    include: {
                        feeType: { select: { name: true } },
                        academicYear: { select: { name: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.studentFee.count({ where })
    ]);

    SuccessResponse(res, "Student fees fetched successfully", {
        studentFees,
        meta: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber)
        }
    }, status.OK);
});

export const getStudentFeeById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const studentFee = await prisma.studentFee.findUnique({
        where: { id },
        include: {
            student: true,
            feeStructure: {
                include: {
                    feeType: true,
                    academicYear: true
                }
            },
            payments: true
        }
    });

    if (!studentFee) {
        throw new ErrorResponse("Student fee record not found", status.Not_Found);
    }

    SuccessResponse(res, "Student fee record fetched successfully", studentFee, status.OK);
});

export const updateStudentFee = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = updateStudentFeeSchema.parse(req.body);

    const existing = await prisma.studentFee.findUnique({ where: { id } });
    if (!existing) throw new ErrorResponse("Student fee record not found", status.Not_Found);

    const updated = await prisma.studentFee.update({
        where: { id },
        data,
        include: {
            student: { select: { firstName: true, lastName: true } },
            feeStructure: {
                include: {
                    feeType: { select: { name: true } }
                }
            }
        }
    });

    SuccessResponse(res, "Student fee updated successfully", updated, status.OK);
});

export const deleteStudentFee = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const studentFee = await prisma.studentFee.findUnique({
        where: { id },
        include: { _count: { select: { payments: true } } }
    });

    if (!studentFee) {
        throw new ErrorResponse("Student fee record not found", status.Not_Found);
    }

    if (studentFee._count.payments > 0) {
        throw new ErrorResponse("Cannot delete student fee record as payments have already been recorded", status.Bad_Request);
    }

    await prisma.studentFee.delete({ where: { id } });

    SuccessResponse(res, "Student fee record deleted successfully", null, status.OK);
});
