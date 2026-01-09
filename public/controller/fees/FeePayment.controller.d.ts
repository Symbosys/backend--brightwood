import type { Request, Response } from "express";
/**
 * @desc Create a new fee payment
 * @route POST /api/v1/fee-payments
 * @access Private/Admin
 */
export declare const createFeePayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc Get all fee payments with filtering and pagination
 * @route GET /api/v1/fee-payments
 * @access Private/Admin
 */
export declare const getAllFeePayments: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc Get single fee payment by ID
 * @route GET /api/v1/fee-payments/:id
 * @access Private/Admin
 */
export declare const getFeePaymentById: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc Update a fee payment
 * @route PATCH /api/v1/fee-payments/:id
 * @access Private/Admin
 */
export declare const updateFeePayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
/**
 * @desc Delete a fee payment
 * @route DELETE /api/v1/fee-payments/:id
 * @access Private/Admin
 */
export declare const deleteFeePayment: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=FeePayment.controller.d.ts.map