import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { createExamTermSchema, updateExamTermSchema } from "../../validation/ExamTerm.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";

/**
 * @desc    Create a new exam term
 * @route   POST /api/v1/exam-term/create
 * @access  Private/Admin
 */
export const createExamTerm = asyncHandler(async (req: Request, res: Response) => {
    // Validate request body
    const data = createExamTermSchema.parse(req.body);

    // 1. Check if School exists
    const school = await prisma.school.findUnique({ where: { id: data.schoolId } });
    if (!school) throw new ErrorResponse("School not found", statusCode.Not_Found);

    // 2. Check if Academic Year exists
    const academicYear = await prisma.academicYear.findUnique({ where: { id: data.academicYearId } });
    if (!academicYear) throw new ErrorResponse("Academic Year not found", statusCode.Not_Found);

    // 3. Confirm academic year belongs to this school
    if (academicYear.schoolId !== data.schoolId) {
        throw new ErrorResponse("Academic Year does not belong to this school", statusCode.Bad_Request);
    }

    // 4. Check for unique term name in this school and year
    const existingTerm = await prisma.examTerm.findUnique({
        where: {
            schoolId_academicYearId_name: {
                schoolId: data.schoolId,
                academicYearId: data.academicYearId,
                name: data.name,
            },
        },
    });

    if (existingTerm) {
        throw new ErrorResponse(`Exam term '${data.name}' already exists for this academic year`, statusCode.Conflict);
    }

    const examTerm = await prisma.examTerm.create({
        data,
        include: {
            academicYear: { select: { name: true } },
            school: { select: { name: true } }
        }
    });

    SuccessResponse(res, "Exam term created successfully", examTerm, statusCode.Created);
});

/**
 * @desc    Get all exam terms with filters
 * @route   GET /api/v1/exam-term
 * @access  Private
 */
export const getAllExamTerms = asyncHandler(async (req: Request, res: Response) => {
    const { schoolId, academicYearId, search } = req.query;

    const whereClause: any = {};

    if (schoolId) whereClause.schoolId = String(schoolId);
    if (academicYearId) whereClause.academicYearId = String(academicYearId);
    if (search) {
        whereClause.name = { contains: String(search) };
    }

    const examTerms = await prisma.examTerm.findMany({
        where: whereClause,
        orderBy: { startDate: "asc" },
        include: {
            academicYear: { select: { name: true } },
            _count: { select: { exams: true } }
        }
    });

    SuccessResponse(res, "Exam terms fetched successfully", examTerms, statusCode.OK);
});

/**
 * @desc    Get exam term by ID
 * @route   GET /api/v1/exam-term/:id
 * @access  Private
 */
export const getExamTermById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const examTerm = await prisma.examTerm.findUnique({
        where: { id },
        include: {
            academicYear: true,
            school: { select: { name: true } },
            exams: {
                include: {
                    subject: { select: { name: true, code: true } },
                    class: { select: { name: true } }
                }
            }
        },
    });

    if (!examTerm) throw new ErrorResponse("Exam term not found", statusCode.Not_Found);

    SuccessResponse(res, "Exam term fetched successfully", examTerm, statusCode.OK);
});

/**
 * @desc    Update exam term
 * @route   PUT /api/v1/exam-term/:id
 * @access  Private/Admin
 */
export const updateExamTerm = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = updateExamTermSchema.parse(req.body);

    const examTerm = await prisma.examTerm.findUnique({ where: { id } });
    if (!examTerm) throw new ErrorResponse("Exam term not found", statusCode.Not_Found);

    // If updating name or academicYear, check for duplicates
    if (data.name || data.academicYearId) {
        const targetName = data.name || examTerm.name;
        const targetAcademicYearId = data.academicYearId || examTerm.academicYearId;

        const existingTerm = await prisma.examTerm.findUnique({
            where: {
                schoolId_academicYearId_name: {
                    schoolId: examTerm.schoolId,
                    academicYearId: targetAcademicYearId,
                    name: targetName,
                },
            },
        });

        // Ensure we aren't colliding with ANOTHER term (not self)
        if (existingTerm && existingTerm.id !== id) {
            throw new ErrorResponse(`Exam term '${targetName}' already exists for the selected academic year`, statusCode.Conflict);
        }
    }

    const updatedTerm = await prisma.examTerm.update({
        where: { id },
        data,
        include: {
            academicYear: { select: { name: true } }
        }
    });

    SuccessResponse(res, "Exam term updated successfully", updatedTerm, statusCode.OK);
});

/**
 * @desc    Delete exam term
 * @route   DELETE /api/v1/exam-term/:id
 * @access  Private/Admin
 */
export const deleteExamTerm = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const examTerm = await prisma.examTerm.findUnique({ where: { id } });
    if (!examTerm) throw new ErrorResponse("Exam term not found", statusCode.Not_Found);

    await prisma.examTerm.delete({ where: { id } });

    SuccessResponse(res, "Exam term deleted successfully", null, statusCode.OK);
});
