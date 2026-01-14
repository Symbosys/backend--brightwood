import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { createTeacherAttendanceSchema } from "../../validation/TeacherAttendance.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";
import { id } from "zod/v4/locales";

/**
 * @desc    Mark attendance for a teacher
 * @route   POST /api/v1/teacher-attendance/mark
 * @access  Private/Admin
 */
export const markTeacherAttendance = asyncHandler(async (req: Request, res: Response) => {
    const data = createTeacherAttendanceSchema.parse(req.body);

    // 1. Check if Teacher exists
    const teacher = await prisma.teacher.findUnique({ where: { id: data.teacherId } });
    if (!teacher) throw new ErrorResponse("Teacher not found", statusCode.Not_Found);

    // 2. Normalize date to start of day
    const attendanceDate = new Date(data.date);
    attendanceDate.setHours(0, 0, 0, 0);

    // 3. Upsert attendance record
    const attendance = await prisma.teacherAttendance.upsert({
        where: {
            teacherId_date: {
                teacherId: data.teacherId,
                date: attendanceDate,
            },
        },
        update: {
            status: data.status,
            notes: data.notes || null,
        },
        create: {
            teacherId: data.teacherId,
            date: attendanceDate,
            status: data.status,
            notes: data.notes || null,
        },
    });

    SuccessResponse(res, "Teacher attendance marked successfully", attendance, statusCode.OK);
});

/**
 * @desc    Get teacher attendance records with filters
 * @route   GET /api/v1/teacher-attendance
 * @access  Private/Admin
 */
export const getTeacherAttendanceRecords = asyncHandler(async (req: Request, res: Response) => {
    const { startDate, endDate, teacherId, schoolId, status } = req.query;

    const whereClause: any = {};

    if (teacherId) whereClause.teacherId = String(teacherId);
    if (status) whereClause.status = status;

    if (startDate || endDate) {
        whereClause.date = {};
        if (startDate) whereClause.date.gte = new Date(String(startDate));
        if (endDate) whereClause.date.lte = new Date(String(endDate));
    }

    // Filter by school if schoolId is provided
    if (schoolId) {
        whereClause.teacher = {
            schoolId: String(schoolId)
        };
    }

    const attendance = await prisma.teacherAttendance.findMany({
        where: whereClause,
        orderBy: { date: "desc" },
        include: {
            teacher: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                }
            }
        }
    });

    SuccessResponse(res, "Teacher attendance records fetched successfully", attendance, statusCode.OK);
});

/**
 * @desc    Delete teacher attendance record
 * @route   DELETE /api/v1/teacher-attendance/:id
 * @access  Private/Admin
 */
export const deleteTeacherAttendance = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const record = await prisma.teacherAttendance.findUnique({ where: { id } });
    if (!record) throw new ErrorResponse("Attendance record not found", statusCode.Not_Found);

    await prisma.teacherAttendance.delete({
        where: { id },
    });

    SuccessResponse(res, "Teacher attendance record deleted successfully", null, statusCode.OK);
});
