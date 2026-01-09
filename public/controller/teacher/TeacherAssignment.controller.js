import { asyncHandler } from "../../middleware/error.middleware.js";
import { createAssignmentSchema, updateAssignmentSchema } from "../../validation/TeacherAssignment.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";
/**
 * @desc    Assign a teacher to a subject and section
 * @route   POST /api/v1/assignment/create
 * @access  Private/Admin
 */
export const createAssignment = asyncHandler(async (req, res) => {
    const data = createAssignmentSchema.parse(req.body);
    // Normalize academicYearId (convert empty string to undefined for Prisma)
    const academicYearId = data.academicYearId || undefined;
    // 1. Check if Teacher exists
    const teacher = await prisma.teacher.findUnique({ where: { id: data.teacherId } });
    if (!teacher)
        throw new ErrorResponse("Teacher not found", statusCode.Not_Found);
    // 2. Check if Subject exists
    const subject = await prisma.subject.findUnique({ where: { id: data.subjectId } });
    if (!subject)
        throw new ErrorResponse("Subject not found", statusCode.Not_Found);
    // 3. Check if Section exists
    const section = await prisma.section.findUnique({ where: { id: data.sectionId } });
    if (!section)
        throw new ErrorResponse("Section not found", statusCode.Not_Found);
    // 4. Check if Academic Year exists if provided
    if (academicYearId) {
        const academicYear = await prisma.academicYear.findUnique({ where: { id: academicYearId } });
        if (!academicYear)
            throw new ErrorResponse("Academic Year not found", statusCode.Not_Found);
    }
    // 5. Check for existing assignment (Unique Constraint)
    const existingAssignment = await prisma.teacherAssignment.findFirst({
        where: {
            teacherId: data.teacherId,
            subjectId: data.subjectId,
            sectionId: data.sectionId,
            academicYearId: academicYearId ?? null,
        },
    });
    if (existingAssignment) {
        throw new ErrorResponse("This teacher is already assigned to this subject in this section", statusCode.Conflict);
    }
    const assignment = await prisma.teacherAssignment.create({
        data: {
            ...data,
            academicYearId: academicYearId,
        },
        include: {
            teacher: true,
            subject: true,
            section: {
                include: { class: true }
            },
            academicYear: true
        }
    });
    SuccessResponse(res, "Teacher assigned successfully", assignment, statusCode.Created);
});
/**
 * @desc    Get all assignments with filters
 * @route   GET /api/v1/assignment
 * @access  Private
 */
export const getAllAssignments = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, teacherId, subjectId, sectionId, academicYearId } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const whereClause = {};
    if (teacherId)
        whereClause.teacherId = String(teacherId);
    if (subjectId)
        whereClause.subjectId = String(subjectId);
    if (sectionId)
        whereClause.sectionId = String(sectionId);
    if (academicYearId)
        whereClause.academicYearId = String(academicYearId);
    const [assignments, total] = await Promise.all([
        prisma.teacherAssignment.findMany({
            where: whereClause,
            skip,
            take: limitNumber,
            orderBy: { createdAt: "desc" },
            include: {
                teacher: { select: { firstName: true, lastName: true, email: true } },
                subject: { select: { name: true, code: true } },
                section: {
                    include: {
                        class: { select: { name: true } }
                    }
                },
                academicYear: { select: { name: true } }
            }
        }),
        prisma.teacherAssignment.count({ where: whereClause }),
    ]);
    SuccessResponse(res, "Assignments fetched successfully", {
        assignments,
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
        },
    }, statusCode.OK);
});
/**
 * @desc    Get assignment by ID
 * @route   GET /api/v1/assignment/:id
 * @access  Private
 */
export const getAssignmentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const assignment = await prisma.teacherAssignment.findUnique({
        where: { id },
        include: {
            teacher: true,
            subject: true,
            section: {
                include: { class: true }
            },
            academicYear: true
        },
    });
    if (!assignment)
        throw new ErrorResponse("Assignment not found", statusCode.Not_Found);
    SuccessResponse(res, "Assignment fetched successfully", assignment, statusCode.OK);
});
/**
 * @desc    Update assignment
 * @route   PUT /api/v1/assignment/:id
 * @access  Private/Admin
 */
export const updateAssignment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = updateAssignmentSchema.parse(req.body);
    const assignment = await prisma.teacherAssignment.findUnique({ where: { id } });
    if (!assignment)
        throw new ErrorResponse("Assignment not found", statusCode.Not_Found);
    const updatedAssignment = await prisma.teacherAssignment.update({
        where: { id },
        data,
        include: {
            teacher: true,
            subject: true,
            section: { include: { class: true } },
            academicYear: true
        }
    });
    SuccessResponse(res, "Assignment updated successfully", updatedAssignment, statusCode.OK);
});
/**
 * @desc    Delete assignment
 * @route   DELETE /api/v1/assignment/:id
 * @access  Private/Admin
 */
export const deleteAssignment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const assignment = await prisma.teacherAssignment.findUnique({ where: { id } });
    if (!assignment)
        throw new ErrorResponse("Assignment not found", statusCode.Not_Found);
    await prisma.teacherAssignment.delete({ where: { id } });
    SuccessResponse(res, "Assignment deleted successfully", null, statusCode.OK);
});
//# sourceMappingURL=TeacherAssignment.controller.js.map