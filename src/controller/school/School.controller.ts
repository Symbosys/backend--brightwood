import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { createSchoolSchema, updateSchoolSchema } from "../../validation/School.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";

export const createSchool = asyncHandler(async (req: Request, res: Response) => {
    const data = createSchoolSchema.parse(req.body);

    // Check for existing school with same email if provided
    if (data.email) {
        const existingSchool = await prisma.school.findUnique({
            where: { email: data.email },
        });
        if (existingSchool) {
            throw new ErrorResponse("School with this email already exists", statusCode.Conflict);
        }
    }

    const school = await prisma.school.create({
        data,
    });

    SuccessResponse(res, "School created successfully", school, statusCode.Created);
});

export const getAllSchools = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search, city, state, country } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const whereClause: any = {};

    if (search) {
        whereClause.OR = [
            { name: { contains: String(search) } },
            { email: { contains: String(search) } },
        ];
    }

    if (city) whereClause.city = { contains: String(city) };
    if (state) whereClause.state = { contains: String(state) };
    if (country) whereClause.country = { contains: String(country) };

    const [schools, total] = await Promise.all([
        prisma.school.findMany({
            where: whereClause,
            skip,
            take: limitNumber,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.school.count({ where: whereClause }),
    ]);

    SuccessResponse(res, "Schools fetched successfully", {
        schools,
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
        }
    }, statusCode.OK);
});

export const getSchoolById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const school = await prisma.school.findUnique({
        where: { id },
        include: {
            academicYears: true,
            // Including counts of related entities could be useful
            _count: {
                select: {
                    students: true,
                    teachers: true,
                    classes: true,
                }
            }
        },
    });

    if (!school) {
        throw new ErrorResponse("School not found", statusCode.Not_Found);
    }

    SuccessResponse(res, "School fetched successfully", school, statusCode.OK);
});

export const updateSchool = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = updateSchoolSchema.parse(req.body);

    // Check for email uniqueness if email is being updated
    if (data.email) {
        const existingSchool = await prisma.school.findUnique({
            where: { email: data.email },
        });
        if (existingSchool && existingSchool.id !== id) {
            throw new ErrorResponse("School with this email already exists", statusCode.Conflict);
        }
    }

    const school = await prisma.school.update({
        where: { id },
        data,
    });

    SuccessResponse(res, "School updated successfully", school, statusCode.OK);
});

export const deleteSchool = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.school.delete({
        where: { id },
    });

    SuccessResponse(res, "School deleted successfully", null, statusCode.OK);
});
