import { asyncHandler } from "../../middleware/error.middleware.js";
import { createAttendanceSchema, updateAttendanceSchema, bulkAttendanceSchema } from "../../validation/StudentAttendance.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";
/**
 * @desc    Mark attendance for a single student
 * @route   POST /api/v1/attendance/mark
 * @access  Private/Teacher
 */
export const markAttendance = asyncHandler(async (req, res) => {
    const data = createAttendanceSchema.parse(req.body);
    // 1. Check if Student exists
    const student = await prisma.student.findUnique({ where: { id: data.studentId } });
    if (!student)
        throw new ErrorResponse("Student not found", statusCode.Not_Found);
    // 2. Normalize date to start of day to avoid time-zone mismatches in unique check
    const attendanceDate = new Date(data.date);
    attendanceDate.setHours(0, 0, 0, 0);
    // 3. Upsert attendance (Update if exists, Create if not)
    const attendance = await prisma.studentAttendance.upsert({
        where: {
            studentId_date: {
                studentId: data.studentId,
                date: attendanceDate,
            },
        },
        update: {
            status: data.status,
            notes: data.notes || null,
            enrollmentId: data.enrollmentId || null,
        },
        create: {
            studentId: data.studentId,
            date: attendanceDate,
            status: data.status,
            notes: data.notes || null,
            enrollmentId: data.enrollmentId || null,
        },
    });
    SuccessResponse(res, "Attendance marked successfully", attendance, statusCode.OK);
});
/**
 * @desc    Mark bulk attendance (e.g. for a whole section)
 * @route   POST /api/v1/attendance/bulk
 * @access  Private/Teacher
 */
export const markBulkAttendance = asyncHandler(async (req, res) => {
    const { date, records } = bulkAttendanceSchema.parse(req.body);
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    // Use a transaction for bulk operations
    const results = await prisma.$transaction(records.map((record) => prisma.studentAttendance.upsert({
        where: {
            studentId_date: {
                studentId: record.studentId,
                date: attendanceDate,
            },
        },
        update: {
            status: record.status,
            notes: record.notes || null,
            enrollmentId: record.enrollmentId || null,
        },
        create: {
            studentId: record.studentId,
            date: attendanceDate,
            status: record.status,
            notes: record.notes || null,
            enrollmentId: record.enrollmentId || null,
        },
    })));
    SuccessResponse(res, `Attendance marked for ${results.length} students`, results, statusCode.OK);
});
/**
 * @desc    Get attendance records with filters
 * @route   GET /api/v1/attendance
 * @access  Private
 */
export const getAttendanceRecords = asyncHandler(async (req, res) => {
    const { startDate, endDate, studentId, sectionId, status } = req.query;
    const whereClause = {};
    if (studentId)
        whereClause.studentId = String(studentId);
    if (status)
        whereClause.status = status;
    if (startDate || endDate) {
        whereClause.date = {};
        if (startDate)
            whereClause.date.gte = new Date(String(startDate));
        if (endDate)
            whereClause.date.lte = new Date(String(endDate));
    }
    if (sectionId) {
        whereClause.enrollment = {
            sectionId: String(sectionId)
        };
    }
    const attendance = await prisma.studentAttendance.findMany({
        where: whereClause,
        orderBy: { date: "desc" },
        include: {
            student: { select: { firstName: true, lastName: true } },
            enrollment: {
                include: {
                    section: {
                        include: { class: { select: { name: true } } }
                    }
                }
            }
        }
    });
    SuccessResponse(res, "Attendance records fetched successfully", attendance, statusCode.OK);
});
/**
 * @desc    Delete attendance record
 * @route   DELETE /api/v1/attendance/:id
 * @access  Private/Admin
 */
export const deleteAttendance = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.studentAttendance.delete({
        where: { id },
    });
    SuccessResponse(res, "Attendance record deleted successfully", null, statusCode.OK);
});
//# sourceMappingURL=StudentAttendance.controller.js.map