import type { Request, Response } from "express";
/**
 * @desc    Mark attendance for a teacher
 * @route   POST /api/v1/teacher-attendance/mark
 * @access  Private/Admin
 */
export declare const markTeacherAttendance: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get teacher attendance records with filters
 * @route   GET /api/v1/teacher-attendance
 * @access  Private/Admin
 */
export declare const getTeacherAttendanceRecords: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Delete teacher attendance record
 * @route   DELETE /api/v1/teacher-attendance/:id
 * @access  Private/Admin
 */
export declare const deleteTeacherAttendance: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=TeacherAttendance.controller.d.ts.map