import type { Request, Response } from "express";
/**
 * @desc    Create a new exam entry
 * @route   POST /api/v1/exam/create
 * @access  Private/Admin
 */
export declare const createExam: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get all exams with filters
 * @route   GET /api/v1/exam
 * @access  Private
 */
export declare const getAllExams: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get exam detail by ID
 * @route   GET /api/v1/exam/:id
 * @access  Private
 */
export declare const getExamById: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Update exam details
 * @route   PUT /api/v1/exam/:id
 * @access  Private/Admin
 */
export declare const updateExam: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Delete an exam
 * @route   DELETE /api/v1/exam/:id
 * @access  Private/Admin
 */
export declare const deleteExam: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=Exam.controller.d.ts.map