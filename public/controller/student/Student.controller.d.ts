import type { Request, Response } from "express";
/**
 * @desc    Create a new student
 * @route   POST /api/v1/students
 * @access  Private/Admin
 */
export declare const createStudent: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get all students with pagination and filtering
 * @route   GET /api/v1/students
 * @access  Private
 */
export declare const getAllStudents: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get student by ID
 * @route   GET /api/v1/students/:id
 * @access  Private
 */
export declare const getStudentById: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Update student
 * @route   PUT /api/v1/students/:id
 * @access  Private/Admin
 */
export declare const updateStudent: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Delete student
 * @route   DELETE /api/v1/students/:id
 * @access  Private/Admin
 */
export declare const deleteStudent: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=Student.controller.d.ts.map