import type { Request, Response } from "express";
/**
 * @desc    Enroll a student into a section for an academic year
 * @route   POST /api/v1/enrollment/create
 * @access  Private/Admin
 */
export declare const createEnrollment: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get all enrollments with filters and search
 * @route   GET /api/v1/enrollment
 * @access  Private
 */
export declare const getAllEnrollments: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get enrollment by ID
 * @route   GET /api/v1/enrollment/:id
 * @access  Private
 */
export declare const getEnrollmentById: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Update enrollment status or move section
 * @route   PUT /api/v1/enrollment/:id
 * @access  Private/Admin
 */
export declare const updateEnrollment: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Delete enrollment
 * @route   DELETE /api/v1/enrollment/:id
 * @access  Private/Admin
 */
export declare const deleteEnrollment: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=StudentEnrollment.controller.d.ts.map