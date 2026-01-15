import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { createClassSchema, updateClassSchema } from "../../validation/Class.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";

export const createClass = asyncHandler(async (req: Request, res: Response) => {
    const data = createClassSchema.parse(req.body);

    // Check for existing class with same name in the same school
    const existingClass = await prisma.class.findUnique({
        where: {
            schoolId_name: {
                schoolId: data.schoolId,
                name: data.name,
            },
        },
    });

    if (existingClass) {
        throw new ErrorResponse("Class with this name already exists in the school", statusCode.Conflict);
    }

    const newClass = await prisma.class.create({
        data,
    });

    SuccessResponse(res, "Class created successfully", newClass, statusCode.Created);
});

export const getAllClasses = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search, schoolId, gradeLevel } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const whereClause: any = {};

    if (schoolId) {
        whereClause.schoolId = String(schoolId);
    }

    if (search) {
        whereClause.name = { contains: String(search) };
    }

    if (gradeLevel) {
        whereClause.gradeLevel = String(gradeLevel);
    }

    const [classes, total] = await Promise.all([
        prisma.class.findMany({
            where: whereClause,
            skip,
            take: limitNumber,
            orderBy: { name: 'asc' },
            include: {
                sections: {
                    orderBy: { name: 'asc' }
                },
                _count: {
                    select: { sections: true }
                }
            }
        }),
        prisma.class.count({ where: whereClause }),
    ]);

    SuccessResponse(res, "Classes fetched successfully", {
        classes,
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
        }
    }, statusCode.OK);
});

export const getClassById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const classData = await prisma.class.findUnique({
        where: { id },
        include: {
            sections: true,
            school: {
                select: { name: true }
            }
        },
    });

    if (!classData) {
        throw new ErrorResponse("Class not found", statusCode.Not_Found);
    }

    SuccessResponse(res, "Class fetched successfully", classData, statusCode.OK);
});

export const updateClass = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = updateClassSchema.parse(req.body);

    const classData = await prisma.class.findUnique({ where: { id } });
    if (!classData) {
        throw new ErrorResponse("Class not found", statusCode.Not_Found);
    }

    // If updating name, check for duplicates in the same school
    if (data.name) {
        const existingClass = await prisma.class.findUnique({
            where: {
                schoolId_name: {
                    schoolId: classData.schoolId,
                    name: data.name,
                },
            },
        });

        if (existingClass && existingClass.id !== id) {
            throw new ErrorResponse("Class with this name already exists in the school", statusCode.Conflict);
        }
    }

    const updatedClass = await prisma.class.update({
        where: { id },
        data,
    });

    SuccessResponse(res, "Class updated successfully", updatedClass, statusCode.OK);
});

export const deleteClass = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Check if class exists
    const classData = await prisma.class.findUnique({ where: { id } });
    if (!classData) {
        throw new ErrorResponse("Class not found", statusCode.Not_Found);
    }

    await prisma.class.delete({
        where: { id },
    });

    SuccessResponse(res, "Class deleted successfully", null, statusCode.OK);
});
