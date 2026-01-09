import type { Request, Response } from "express";
/**
 * @desc    Assign a teacher to a subject and section
 * @route   POST /api/v1/assignment/create
 * @access  Private/Admin
 */
export declare const createAssignment: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get all assignments with filters
 * @route   GET /api/v1/assignment
 * @access  Private
 */
export declare const getAllAssignments: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get assignment by ID
 * @route   GET /api/v1/assignment/:id
 * @access  Private
 */
export declare const getAssignmentById: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Update assignment
 * @route   PUT /api/v1/assignment/:id
 * @access  Private/Admin
 */
export declare const updateAssignment: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Delete assignment
 * @route   DELETE /api/v1/assignment/:id
 * @access  Private/Admin
 */
export declare const deleteAssignment: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=TeacherAssignment.controller.d.ts.map