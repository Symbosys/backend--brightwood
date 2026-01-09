import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { createSubjectSchema, updateSubjectSchema } from "../../validation/Subject.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";

/**
 * @desc    Create a new subject
 * @route   POST /api/v1/subject/create
 * @access  Private/Admin
 */
export const createSubject = asyncHandler(async (req: Request, res: Response) => {
    const data = createSubjectSchema.parse(req.body);

    // Check if school exists
    const school = await prisma.school.findUnique({
        where: { id: data.schoolId },
    });

    if (!school) {
        throw new ErrorResponse("School not found", statusCode.Not_Found);
    }

    // Check unique subject name per school
    const existingSubject = await prisma.subject.findUnique({
        where: {
            schoolId_name: {
                schoolId: data.schoolId,
                name: data.name,
            },
        },
    });

    if (existingSubject) {
        throw new ErrorResponse("Subject with this name already exists in this school", statusCode.Conflict);
    }

    const subject = await prisma.subject.create({
        data,
    });

    SuccessResponse(res, "Subject created successfully", subject, statusCode.Created);
});

/**
 * @desc    Get all subjects with pagination and search
 * @route   GET /api/v1/subject
 * @access  Private
 */
export const getAllSubjects = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search, schoolId } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const whereClause: any = {};

    if (schoolId) {
        whereClause.schoolId = String(schoolId);
    }

    if (search) {
        whereClause.OR = [
            { name: { contains: String(search) } },
            { code: { contains: String(search) } },
        ];
    }

    const [subjects, total] = await Promise.all([
        prisma.subject.findMany({
            where: whereClause,
            skip,
            take: limitNumber,
            orderBy: { name: "asc" },
            include: {
                _count: {
                    select: { teacherAssignments: true },
                },
            },
        }),
        prisma.subject.count({ where: whereClause }),
    ]);

    SuccessResponse(
        res,
        "Subjects fetched successfully",
        {
            subjects,
            meta: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber),
            },
        },
        statusCode.OK
    );
});

/**
 * @desc    Get subject by ID
 * @route   GET /api/v1/subject/:id
 * @access  Private
 */
export const getSubjectById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const subject = await prisma.subject.findUnique({
        where: { id },
        include: {
            school: {
                select: { name: true },
            },
            teacherAssignments: {
                include: {
                    teacher: true,
                    section: {
                        include: {
                            class: true
                        }
                    }
                }
            }
        },
    });

    if (!subject) {
        throw new ErrorResponse("Subject not found", statusCode.Not_Found);
    }

    SuccessResponse(res, "Subject fetched successfully", subject, statusCode.OK);
});

/**
 * @desc    Update subject
 * @route   PUT /api/v1/subject/:id
 * @access  Private/Admin
 */
export const updateSubject = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = updateSubjectSchema.parse(req.body);

    const subject = await prisma.subject.findUnique({ where: { id } });

    if (!subject) {
        throw new ErrorResponse("Subject not found", statusCode.Not_Found);
    }

    // If updating name, check unique name per school
    if (data.name && data.name !== subject.name) {
        const existingSubject = await prisma.subject.findUnique({
            where: {
                schoolId_name: {
                    schoolId: subject.schoolId,
                    name: data.name,
                },
            },
        });

        if (existingSubject) {
            throw new ErrorResponse("Subject with this name already exists in this school", statusCode.Conflict);
        }
    }

    const updatedSubject = await prisma.subject.update({
        where: { id },
        data,
    });

    SuccessResponse(res, "Subject updated successfully", updatedSubject, statusCode.OK);
});

/**
 * @desc    Delete subject
 * @route   DELETE /api/v1/subject/:id
 * @access  Private/Admin
 */
export const deleteSubject = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const subject = await prisma.subject.findUnique({ where: { id } });

    if (!subject) {
        throw new ErrorResponse("Subject not found", statusCode.Not_Found);
    }

    await prisma.subject.delete({
        where: { id },
    });

    SuccessResponse(res, "Subject deleted successfully", null, statusCode.OK);
});
