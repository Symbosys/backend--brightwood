import type { Request, Response } from "express";
/**
 * @desc    Create a new subject
 * @route   POST /api/v1/subject/create
 * @access  Private/Admin
 */
export declare const createSubject: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get all subjects with pagination and search
 * @route   GET /api/v1/subject
 * @access  Private
 */
export declare const getAllSubjects: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get subject by ID
 * @route   GET /api/v1/subject/:id
 * @access  Private
 */
export declare const getSubjectById: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Update subject
 * @route   PUT /api/v1/subject/:id
 * @access  Private/Admin
 */
export declare const updateSubject: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Delete subject
 * @route   DELETE /api/v1/subject/:id
 * @access  Private/Admin
 */
export declare const deleteSubject: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=Subject.controller.d.ts.map