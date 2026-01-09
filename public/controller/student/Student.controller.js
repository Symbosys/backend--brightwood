import { asyncHandler } from "../../middleware/error.middleware.js";
import { createStudentSchema, updateStudentSchema } from "../../validation/Student.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";
/**
 * @desc    Create a new student
 * @route   POST /api/v1/students
 * @access  Private/Admin
 */
export const createStudent = asyncHandler(async (req, res) => {
    const data = createStudentSchema.parse(req.body);
    // Check if school exists
    const school = await prisma.school.findUnique({
        where: { id: data.schoolId },
    });
    if (!school) {
        throw new ErrorResponse("School not found", statusCode.Not_Found);
    }
    // Check if email already exists
    if (data.email) {
        const existingStudent = await prisma.student.findUnique({
            where: { email: data.email },
        });
        if (existingStudent) {
            throw new ErrorResponse("Student with this email already exists", statusCode.Conflict);
        }
    }
    const student = await prisma.student.create({
        data,
    });
    SuccessResponse(res, "Student created successfully", student, statusCode.Created);
});
/**
 * @desc    Get all students with pagination and filtering
 * @route   GET /api/v1/students
 * @access  Private
 */
export const getAllStudents = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search, schoolId, gender } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const whereClause = {};
    if (schoolId) {
        whereClause.schoolId = String(schoolId);
    }
    if (gender) {
        whereClause.gender = String(gender);
    }
    if (search) {
        whereClause.OR = [
            { firstName: { contains: String(search) } },
            { lastName: { contains: String(search) } },
            { email: { contains: String(search) } },
        ];
    }
    const [students, total] = await Promise.all([
        prisma.student.findMany({
            where: whereClause,
            skip,
            take: limitNumber,
            orderBy: { createdAt: "desc" },
            include: {
                school: {
                    select: { name: true },
                },
            },
        }),
        prisma.student.count({ where: whereClause }),
    ]);
    SuccessResponse(res, "Students fetched successfully", {
        students,
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
        },
    }, statusCode.OK);
});
/**
 * @desc    Get student by ID
 * @route   GET /api/v1/students/:id
 * @access  Private
 */
export const getStudentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
        where: { id },
        include: {
            school: {
                select: { name: true },
            },
            enrollments: {
                include: {
                    section: {
                        include: {
                            class: true,
                        },
                    },
                    academicYear: true,
                },
            },
            parents: true,
        },
    });
    if (!student) {
        throw new ErrorResponse("Student not found", statusCode.Not_Found);
    }
    SuccessResponse(res, "Student fetched successfully", student, statusCode.OK);
});
/**
 * @desc    Update student
 * @route   PUT /api/v1/students/:id
 * @access  Private/Admin
 */
export const updateStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = updateStudentSchema.parse(req.body);
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
        throw new ErrorResponse("Student not found", statusCode.Not_Found);
    }
    // Check email uniqueness if email is being updated
    if (data.email && data.email !== student.email) {
        const existingStudent = await prisma.student.findUnique({
            where: { email: data.email },
        });
        if (existingStudent) {
            throw new ErrorResponse("Student with this email already exists", statusCode.Conflict);
        }
    }
    const updatedStudent = await prisma.student.update({
        where: { id },
        data,
    });
    SuccessResponse(res, "Student updated successfully", updatedStudent, statusCode.OK);
});
/**
 * @desc    Delete student
 * @route   DELETE /api/v1/students/:id
 * @access  Private/Admin
 */
export const deleteStudent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const student = await prisma.student.findUnique({ where: { id } });
    if (!student) {
        throw new ErrorResponse("Student not found", statusCode.Not_Found);
    }
    await prisma.student.delete({
        where: { id },
    });
    SuccessResponse(res, "Student deleted successfully", null, statusCode.OK);
});
//# sourceMappingURL=Student.controller.js.map