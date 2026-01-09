import type { Request, Response } from "express";
/**
 * @desc    Mark result for a single student
 * @route   POST /api/v1/exam-result/mark
 * @access  Private/Teacher/Admin
 */
export declare const markExamResult: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Bulk mark results for an exam
 * @route   POST /api/v1/exam-result/bulk
 * @access  Private/Teacher/Admin
 */
export declare const markBulkExamResults: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get exam results with filters
 * @route   GET /api/v1/exam-result
 * @access  Private
 */
export declare const getExamResults: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get result by ID
 * @route   GET /api/v1/exam-result/:id
 * @access  Private
 */
export declare const getResultById: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Update specific result record
 * @route   PUT /api/v1/exam-result/:id
 * @access  Private/Admin
 */
export declare const updateResult: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Delete a result record
 * @route   DELETE /api/v1/exam-result/:id
 * @access  Private/Admin
 */
export declare const deleteResult: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=ExamResult.controller.d.ts.map