import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { createSectionSchema, updateSectionSchema } from "../../validation/Section.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";

export const createSection = asyncHandler(async (req: Request, res: Response) => {
    const data = createSectionSchema.parse(req.body);

    // Verify Class exists
    const classExists = await prisma.class.findUnique({
        where: { id: data.classId }
    });
    if (!classExists) {
        throw new ErrorResponse("Class not found", statusCode.Not_Found);
    }

    // Verify Teacher exists if provided
    if (data.classTeacherId) {
        const teacherExists = await prisma.teacher.findUnique({
            where: { id: data.classTeacherId }
        });
        if (!teacherExists) {
            throw new ErrorResponse("Teacher not found", statusCode.Not_Found);
        }
    }

    // Check for duplicate section name in the class
    const existingSection = await prisma.section.findUnique({
        where: {
            classId_name: {
                classId: data.classId,
                name: data.name,
            },
        },
    });

    if (existingSection) {
        throw new ErrorResponse("Section with this name already exists in the class", statusCode.Conflict);
    }

    const section = await prisma.section.create({
        data,
    });

    SuccessResponse(res, "Section created successfully", section, statusCode.Created);
});

export const getAllSections = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search, classId } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const whereClause: any = {};

    if (classId) {
        whereClause.classId = String(classId);
    }

    if (search) {
        whereClause.name = { contains: String(search) };
    }

    const [sections, total] = await Promise.all([
        prisma.section.findMany({
            where: whereClause,
            skip,
            take: limitNumber,
            orderBy: { name: 'asc' },
            include: {
                class: {
                    select: { name: true, gradeLevel: true }
                },
                classTeacher: {
                    select: { firstName: true, lastName: true }
                },
                _count: {
                    select: { studentEnrollments: true }
                }
            }
        }),
        prisma.section.count({ where: whereClause }),
    ]);

    SuccessResponse(res, "Sections fetched successfully", {
        sections,
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
        }
    }, statusCode.OK);
});

export const getSectionById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const section = await prisma.section.findUnique({
        where: { id },
        include: {
            class: true,
            classTeacher: true,
            studentEnrollments: {
                include: {
                    student: true
                }
            }
        },
    });

    if (!section) {
        throw new ErrorResponse("Section not found", statusCode.Not_Found);
    }

    SuccessResponse(res, "Section fetched successfully", section, statusCode.OK);
});

export const updateSection = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = updateSectionSchema.parse(req.body);

    const section = await prisma.section.findUnique({ where: { id } });
    if (!section) {
        throw new ErrorResponse("Section not found", statusCode.Not_Found);
    }

    // Verify Teacher exists if being updated
    if (data.classTeacherId) {
        const teacherExists = await prisma.teacher.findUnique({
            where: { id: data.classTeacherId }
        });
        if (!teacherExists) {
            throw new ErrorResponse("Teacher not found", statusCode.Not_Found);
        }
    }

    // If name is being updated, check for duplicates in the same class
    if (data.name) {
        const existingSection = await prisma.section.findUnique({
            where: {
                classId_name: {
                    classId: section.classId,
                    name: data.name,
                },
            },
        });

        if (existingSection && existingSection.id !== id) {
            throw new ErrorResponse("Section with this name already exists in the class", statusCode.Conflict);
        }
    }

    const updatedSection = await prisma.section.update({
        where: { id },
        data,
    });

    SuccessResponse(res, "Section updated successfully", updatedSection, statusCode.OK);
});

export const deleteSection = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Check if section exists
    const section = await prisma.section.findUnique({ where: { id } });
    if (!section) {
        throw new ErrorResponse("Section not found", statusCode.Not_Found);
    }

    await prisma.section.delete({
        where: { id },
    });

    SuccessResponse(res, "Section deleted successfully", null, statusCode.OK);
});
