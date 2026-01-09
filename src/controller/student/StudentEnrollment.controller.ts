import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { createEnrollmentSchema, updateEnrollmentSchema } from "../../validation/StudentEnrollment.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";

/**
 * @desc    Enroll a student into a section for an academic year
 * @route   POST /api/v1/enrollment/create
 * @access  Private/Admin
 */
export const createEnrollment = asyncHandler(async (req: Request, res: Response) => {
    const data = createEnrollmentSchema.parse(req.body);

    // 1. Check if Student exists
    const student = await prisma.student.findUnique({ where: { id: data.studentId } });
    if (!student) throw new ErrorResponse("Student not found", statusCode.Not_Found);

    // 2. Check if Section exists
    const section = await prisma.section.findUnique({
        where: { id: data.sectionId },
        include: { class: true }
    });
    if (!section) throw new ErrorResponse("Section not found", statusCode.Not_Found);

    // 3. Check if Academic Year exists
    const academicYear = await prisma.academicYear.findUnique({ where: { id: data.academicYearId } });
    if (!academicYear) throw new ErrorResponse("Academic Year not found", statusCode.Not_Found);

    // 4. Check for existing enrollment in this academic year (Unique Constraint)
    const existingEnrollment = await prisma.studentEnrollment.findUnique({
        where: {
            studentId_academicYearId: {
                studentId: data.studentId,
                academicYearId: data.academicYearId,
            },
        },
    });

    if (existingEnrollment) {
        throw new ErrorResponse("Student is already enrolled for this academic year", statusCode.Conflict);
    }

    // 5. Check Section Capacity (Optional but recommended)
    if (section.capacity) {
        const currentEnrolledCount = await prisma.studentEnrollment.count({
            where: {
                sectionId: data.sectionId,
                academicYearId: data.academicYearId,
                status: "Active"
            }
        });

        if (currentEnrolledCount >= section.capacity) {
            throw new ErrorResponse(`Section ${section.name} for class ${section.class.name} has reached its capacity (${section.capacity})`, statusCode.Conflict);
        }
    }

    const enrollment = await prisma.studentEnrollment.create({
        data,
        include: {
            student: true,
            section: {
                include: { class: true }
            },
            academicYear: true
        }
    });

    SuccessResponse(res, "Student enrolled successfully", enrollment, statusCode.Created);
});

/**
 * @desc    Get all enrollments with filters and search
 * @route   GET /api/v1/enrollment
 * @access  Private
 */
export const getAllEnrollments = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, studentId, sectionId, academicYearId, status, search } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const whereClause: any = {};

    if (studentId) whereClause.studentId = String(studentId);
    if (sectionId) whereClause.sectionId = String(sectionId);
    if (academicYearId) whereClause.academicYearId = String(academicYearId);
    if (status) whereClause.status = String(status);

    if (search) {
        whereClause.student = {
            OR: [
                { firstName: { contains: String(search) } },
                { lastName: { contains: String(search) } },
            ],
        };
    }

    const [enrollments, total] = await Promise.all([
        prisma.studentEnrollment.findMany({
            where: whereClause,
            skip,
            take: limitNumber,
            orderBy: { createdAt: "desc" },
            include: {
                student: {
                    select: { id: true, firstName: true, lastName: true, email: true }
                },
                section: {
                    include: {
                        class: { select: { name: true } }
                    }
                },
                academicYear: { select: { name: true } }
            }
        }),
        prisma.studentEnrollment.count({ where: whereClause }),
    ]);

    SuccessResponse(
        res,
        "Enrollments fetched successfully",
        {
            enrollments,
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
 * @desc    Get enrollment by ID
 * @route   GET /api/v1/enrollment/:id
 * @access  Private
 */
export const getEnrollmentById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const enrollment = await prisma.studentEnrollment.findUnique({
        where: { id },
        include: {
            student: true,
            section: {
                include: { class: true }
            },
            academicYear: true,
            studentAttendances: true
        },
    });

    if (!enrollment) throw new ErrorResponse("Enrollment not found", statusCode.Not_Found);

    SuccessResponse(res, "Enrollment fetched successfully", enrollment, statusCode.OK);
});

/**
 * @desc    Update enrollment status or move section
 * @route   PUT /api/v1/enrollment/:id
 * @access  Private/Admin
 */
export const updateEnrollment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = updateEnrollmentSchema.parse(req.body);

    const enrollment = await prisma.studentEnrollment.findUnique({ where: { id } });
    if (!enrollment) throw new ErrorResponse("Enrollment not found", statusCode.Not_Found);

    // If moving section, check unique constraint if year is also changed, or just capacity
    if (data.sectionId && data.sectionId !== enrollment.sectionId) {
        const section = await prisma.section.findUnique({
            where: { id: data.sectionId },
            include: { class: true }
        });
        if (!section) throw new ErrorResponse("New Section not found", statusCode.Not_Found);

        if (section.capacity) {
            const currentEnrolledCount = await prisma.studentEnrollment.count({
                where: {
                    sectionId: data.sectionId,
                    academicYearId: data.academicYearId || enrollment.academicYearId,
                    status: "Active"
                }
            });
            if (currentEnrolledCount >= section.capacity) {
                throw new ErrorResponse(`Target Section ${section.name} is full`, statusCode.Conflict);
            }
        }
    }

    const updatedEnrollment = await prisma.studentEnrollment.update({
        where: { id },
        data,
        include: {
            student: true,
            section: { include: { class: true } },
            academicYear: true
        }
    });

    SuccessResponse(res, "Enrollment updated successfully", updatedEnrollment, statusCode.OK);
});

/**
 * @desc    Delete enrollment
 * @route   DELETE /api/v1/enrollment/:id
 * @access  Private/Admin
 */
export const deleteEnrollment = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const enrollment = await prisma.studentEnrollment.findUnique({ where: { id } });
    if (!enrollment) throw new ErrorResponse("Enrollment not found", statusCode.Not_Found);

    await prisma.studentEnrollment.delete({ where: { id } });

    SuccessResponse(res, "Enrollment deleted successfully", null, statusCode.OK);
});
