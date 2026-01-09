import type { Request, Response } from "express";
/**
 * @desc    Create a new exam term
 * @route   POST /api/v1/exam-term/create
 * @access  Private/Admin
 */
export declare const createExamTerm: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get all exam terms with filters
 * @route   GET /api/v1/exam-term
 * @access  Private
 */
export declare const getAllExamTerms: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get exam term by ID
 * @route   GET /api/v1/exam-term/:id
 * @access  Private
 */
export declare const getExamTermById: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Update exam term
 * @route   PUT /api/v1/exam-term/:id
 * @access  Private/Admin
 */
export declare const updateExamTerm: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Delete exam term
 * @route   DELETE /api/v1/exam-term/:id
 * @access  Private/Admin
 */
export declare const deleteExamTerm: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=ExamTerm.controller.d.ts.map