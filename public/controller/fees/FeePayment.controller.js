import { asyncHandler } from "../../middleware/error.middleware.js";
import { createFeePaymentSchema, updateFeePaymentSchema, feePaymentQuerySchema } from "../../validation/FeePayment.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode as status } from "../../types/types.js";
/**
 * @desc Create a new fee payment
 * @route POST /api/v1/fee-payments
 * @access Private/Admin
 */
export const createFeePayment = asyncHandler(async (req, res) => {
    const data = createFeePaymentSchema.parse(req.body);
    // 1. Check if student fee record exists
    const studentFee = await prisma.studentFee.findUnique({
        where: { id: data.studentFeeId },
        include: {
            payments: true
        }
    });
    if (!studentFee) {
        throw new ErrorResponse("Student fee record not found", status.Not_Found);
    }
    if (studentFee.status === "PAID") {
        throw new ErrorResponse("This fee has already been fully paid", status.Bad_Request);
    }
    // 2. Calculate current status and remaining balance
    const totalPaidBefore = studentFee.payments.reduce((sum, p) => sum + p.amount, 0);
    const totalPayable = studentFee.amount - studentFee.discount;
    const remainingBalance = totalPayable - totalPaidBefore;
    // 3. Validate payment amount
    if (data.amount > remainingBalance + 0.01) { // Adding small epsilon for float precision
        throw new ErrorResponse(`Payment amount (${data.amount}) exceeds remaining balance (${remainingBalance.toFixed(2)})`, status.Bad_Request);
    }
    // 4. Check for duplicate transactionId if provided
    if (data.transactionId) {
        const existingPayment = await prisma.feePayment.findUnique({
            where: { transactionId: data.transactionId }
        });
        if (existingPayment) {
            throw new ErrorResponse("Transaction ID already exists", status.Conflict);
        }
    }
    // 5. Use transaction to create payment and update student fee status
    const result = await prisma.$transaction(async (tx) => {
        const payment = await tx.feePayment.create({
            data: {
                studentFeeId: data.studentFeeId,
                amount: data.amount,
                paymentDate: data.paymentDate,
                paymentMethod: data.paymentMethod,
                transactionId: data.transactionId,
                notes: data.notes
            }
        });
        const newTotalPaid = totalPaidBefore + data.amount;
        let newStatus = "PARTIAL";
        if (newTotalPaid >= totalPayable - 0.01) {
            newStatus = "PAID";
        }
        else if (newTotalPaid <= 0) {
            newStatus = "UNPAID";
        }
        await tx.studentFee.update({
            where: { id: data.studentFeeId },
            data: { status: newStatus }
        });
        return payment;
    });
    SuccessResponse(res, "Fee payment recorded successfully", result, status.Created);
});
/**
 * @desc Get all fee payments with filtering and pagination
 * @route GET /api/v1/fee-payments
 * @access Private/Admin
 */
export const getAllFeePayments = asyncHandler(async (req, res) => {
    const validatedQuery = feePaymentQuerySchema.parse(req.query);
    const { studentFeeId, paymentMethod, startDate, endDate, page, limit } = validatedQuery;
    const skip = (page - 1) * limit;
    const where = {};
    if (studentFeeId)
        where.studentFeeId = studentFeeId;
    if (paymentMethod)
        where.paymentMethod = { contains: paymentMethod };
    if (startDate || endDate) {
        where.paymentDate = {};
        if (startDate)
            where.paymentDate.gte = startDate;
        if (endDate)
            where.paymentDate.lte = endDate;
    }
    const [payments, total] = await Promise.all([
        prisma.feePayment.findMany({
            where,
            skip,
            take: limit,
            include: {
                studentFee: {
                    include: {
                        student: { select: { firstName: true, lastName: true, email: true } },
                        feeStructure: {
                            include: {
                                feeType: { select: { name: true } }
                            }
                        }
                    }
                }
            },
            orderBy: { paymentDate: 'desc' }
        }),
        prisma.feePayment.count({ where })
    ]);
    SuccessResponse(res, "Fee payments fetched successfully", {
        payments,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    }, status.OK);
});
/**
 * @desc Get single fee payment by ID
 * @route GET /api/v1/fee-payments/:id
 * @access Private/Admin
 */
export const getFeePaymentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payment = await prisma.feePayment.findUnique({
        where: { id },
        include: {
            studentFee: {
                include: {
                    student: true,
                    feeStructure: {
                        include: {
                            feeType: true,
                            academicYear: true
                        }
                    }
                }
            }
        }
    });
    if (!payment) {
        throw new ErrorResponse("Fee payment record not found", status.Not_Found);
    }
    SuccessResponse(res, "Fee payment record fetched successfully", payment, status.OK);
});
/**
 * @desc Update a fee payment
 * @route PATCH /api/v1/fee-payments/:id
 * @access Private/Admin
 */
export const updateFeePayment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = updateFeePaymentSchema.parse(req.body);
    const existingPayment = await prisma.feePayment.findUnique({
        where: { id },
        include: { studentFee: { include: { payments: true } } }
    });
    if (!existingPayment) {
        throw new ErrorResponse("Fee payment record not found", status.Not_Found);
    }
    // Check for duplicate transactionId if being updated
    if (data.transactionId && data.transactionId !== existingPayment.transactionId) {
        const duplicate = await prisma.feePayment.findUnique({
            where: { transactionId: data.transactionId }
        });
        if (duplicate) {
            throw new ErrorResponse("Transaction ID already exists", status.Conflict);
        }
    }
    // If amount is being updated, we need to recalculate student fee status
    const result = await prisma.$transaction(async (tx) => {
        const updatedPayment = await tx.feePayment.update({
            where: { id },
            data
        });
        if (data.amount !== undefined) {
            // Recalculate total paid
            const allPayments = await tx.feePayment.findMany({
                where: { studentFeeId: existingPayment.studentFeeId }
            });
            const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
            const totalPayable = existingPayment.studentFee.amount - existingPayment.studentFee.discount;
            let newStatus = "PARTIAL";
            if (totalPaid >= totalPayable - 0.01) {
                newStatus = "PAID";
            }
            else if (totalPaid <= 0) {
                newStatus = "UNPAID";
            }
            await tx.studentFee.update({
                where: { id: existingPayment.studentFeeId },
                data: { status: newStatus }
            });
        }
        return updatedPayment;
    });
    SuccessResponse(res, "Fee payment updated successfully", result, status.OK);
});
/**
 * @desc Delete a fee payment
 * @route DELETE /api/v1/fee-payments/:id
 * @access Private/Admin
 */
export const deleteFeePayment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payment = await prisma.feePayment.findUnique({
        where: { id },
        include: { studentFee: true }
    });
    if (!payment) {
        throw new ErrorResponse("Fee payment record not found", status.Not_Found);
    }
    await prisma.$transaction(async (tx) => {
        await tx.feePayment.delete({
            where: { id }
        });
        // Recalculate total paid after deletion
        const remainingPayments = await tx.feePayment.findMany({
            where: { studentFeeId: payment.studentFeeId }
        });
        const totalPaid = remainingPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalPayable = payment.studentFee.amount - payment.studentFee.discount;
        let newStatus = "PARTIAL";
        if (totalPaid >= totalPayable - 0.01) {
            newStatus = "PAID";
        }
        else if (totalPaid <= 0) {
            newStatus = "UNPAID";
        }
        await tx.studentFee.update({
            where: { id: payment.studentFeeId },
            data: { status: newStatus }
        });
    });
    SuccessResponse(res, "Fee payment deleted successfully", null, status.OK);
});
//# sourceMappingURL=FeePayment.controller.js.map