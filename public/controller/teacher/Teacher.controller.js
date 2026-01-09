import { asyncHandler } from "../../middleware/error.middleware.js";
import { createTeacherSchema, updateTeacherSchema } from "../../validation/Teacher.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";
export const createTeacher = asyncHandler(async (req, res) => {
    const data = createTeacherSchema.parse(req.body);
    // Check if school exists
    const schoolExists = await prisma.school.findUnique({
        where: { id: data.schoolId }
    });
    if (!schoolExists) {
        throw new ErrorResponse("School not found", statusCode.Not_Found);
    }
    // Check for unique email
    const existingTeacher = await prisma.teacher.findUnique({
        where: { email: data.email },
    });
    if (existingTeacher) {
        throw new ErrorResponse("Teacher with this email already exists", statusCode.Conflict);
    }
    const teacher = await prisma.teacher.create({
        data,
    });
    SuccessResponse(res, "Teacher created successfully", teacher, statusCode.Created);
});
export const getAllTeachers = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, schoolId } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const whereClause = {};
    if (schoolId) {
        whereClause.schoolId = String(schoolId);
    }
    if (search) {
        whereClause.OR = [
            { firstName: { contains: String(search) } },
            { lastName: { contains: String(search) } },
            { email: { contains: String(search) } },
        ];
    }
    const [teachers, total] = await Promise.all([
        prisma.teacher.findMany({
            where: whereClause,
            skip,
            take: limitNumber,
            orderBy: { firstName: 'asc' },
            include: {
                school: {
                    select: { name: true }
                },
                _count: {
                    select: { assignments: true, sectionsAsTeacher: true }
                }
            }
        }),
        prisma.teacher.count({ where: whereClause }),
    ]);
    SuccessResponse(res, "Teachers fetched successfully", {
        teachers,
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
        }
    }, statusCode.OK);
});
export const getTeacherById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const teacher = await prisma.teacher.findUnique({
        where: { id },
        include: {
            school: true,
            sectionsAsTeacher: {
                include: {
                    class: true
                }
            },
            assignments: {
                include: {
                    subject: true,
                    section: {
                        include: {
                            class: true
                        }
                    },
                    academicYear: true
                }
            }
        },
    });
    if (!teacher) {
        throw new ErrorResponse("Teacher not found", statusCode.Not_Found);
    }
    SuccessResponse(res, "Teacher fetched successfully", teacher, statusCode.OK);
});
export const updateTeacher = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = updateTeacherSchema.parse(req.body);
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
        throw new ErrorResponse("Teacher not found", statusCode.Not_Found);
    }
    // Check for email uniqueness if email is being updated
    if (data.email) {
        const existingTeacher = await prisma.teacher.findUnique({
            where: { email: data.email },
        });
        if (existingTeacher && existingTeacher.id !== id) {
            throw new ErrorResponse("Teacher with this email already exists", statusCode.Conflict);
        }
    }
    const updatedTeacher = await prisma.teacher.update({
        where: { id },
        data,
    });
    SuccessResponse(res, "Teacher updated successfully", updatedTeacher, statusCode.OK);
});
export const deleteTeacher = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const teacher = await prisma.teacher.findUnique({ where: { id } });
    if (!teacher) {
        throw new ErrorResponse("Teacher not found", statusCode.Not_Found);
    }
    await prisma.teacher.delete({
        where: { id },
    });
    SuccessResponse(res, "Teacher deleted successfully", null, statusCode.OK);
});
//# sourceMappingURL=Teacher.controller.js.map