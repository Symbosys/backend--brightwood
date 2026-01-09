import type { Request, Response } from "express";
/**
 * @desc    Create a new parent
 * @route   POST /api/v1/parent/create
 * @access  Private/Admin
 */
export declare const createParent: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get all parents with pagination and search
 * @route   GET /api/v1/parent
 * @access  Private
 */
export declare const getAllParents: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Get parent by ID
 * @route   GET /api/v1/parent/:id
 * @access  Private
 */
export declare const getParentById: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Update parent info and children links
 * @route   PUT /api/v1/parent/:id
 * @access  Private/Admin
 */
export declare const updateParent: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc    Delete parent
 * @route   DELETE /api/v1/parent/:id
 * @access  Private/Admin
 */
export declare const deleteParent: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=Parent.controller.d.ts.map