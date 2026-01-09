import type { Request, Response } from "express";
/**
 * @desc    Mark attendance for a single student
 * @route   POST /api/v1/attendance/mark
 * @access  Private/Teacher
 */
export declare const markAttendance: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Mark bulk attendance (e.g. for a whole section)
 * @route   POST /api/v1/attendance/bulk
 * @access  Private/Teacher
 */
export declare const markBulkAttendance: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get attendance records with filters
 * @route   GET /api/v1/attendance
 * @access  Private
 */
export declare const getAttendanceRecords: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Delete attendance record
 * @route   DELETE /api/v1/attendance/:id
 * @access  Private/Admin
 */
export declare const deleteAttendance: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=StudentAttendance.controller.d.ts.map