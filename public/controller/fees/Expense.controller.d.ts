import type { Request, Response } from "express";
/**
 * @desc Create a new expense
 * @route POST /api/v1/expense
 * @access Private/Admin
 */
export declare const createExpense: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc Get all expenses with filtering and pagination
 * @route GET /api/v1/expense
 * @access Private/Admin
 */
export declare const getAllExpenses: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc Get single expense by ID
 * @route GET /api/v1/expense/:id
 * @access Private/Admin
 */
export declare const getExpenseById: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc Update an expense
 * @route PUT /api/v1/expense/:id
 * @access Private/Admin
 */
export declare const updateExpense: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc Delete an expense
 * @route DELETE /api/v1/expense/:id
 * @access Private/Admin
 */
export declare const deleteExpense: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc Update expense status
 * @route PATCH /api/v1/expense/:id/status
 * @access Private/Admin
 */
export declare const updateExpenseStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=Expense.controller.d.ts.map