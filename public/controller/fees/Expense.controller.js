import { asyncHandler } from "../../middleware/error.middleware.js";
import { createExpenseSchema, updateExpenseSchema, expenseQuerySchema } from "../../validation/Expense.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode as status } from "../../types/types.js";
/**
 * @desc Create a new expense
 * @route POST /api/v1/expense
 * @access Private/Admin
 */
export const createExpense = asyncHandler(async (req, res) => {
    const data = createExpenseSchema.parse(req.body);
    // Check if school exists
    const school = await prisma.school.findUnique({
        where: { id: data.schoolId }
    });
    if (!school) {
        throw new ErrorResponse("School not found", status.Not_Found);
    }
    const expense = await prisma.expense.create({
        data: {
            title: data.title,
            description: data.description,
            category: data.category,
            amount: data.amount,
            expenseDate: data.expenseDate ? new Date(data.expenseDate) : new Date(),
            status: data.status || "PENDING",
            receiptUrl: data.receiptUrl || null,
            notes: data.notes,
            schoolId: data.schoolId,
        }
    });
    SuccessResponse(res, "Expense created successfully", expense, status.Created);
});
/**
 * @desc Get all expenses with filtering and pagination
 * @route GET /api/v1/expense
 * @access Private/Admin
 */
export const getAllExpenses = asyncHandler(async (req, res) => {
    const validatedQuery = expenseQuerySchema.parse(req.query);
    const { schoolId, category, status: expenseStatus, startDate, endDate, search, page, limit } = validatedQuery;
    const skip = (page - 1) * limit;
    const where = {};
    if (schoolId)
        where.schoolId = schoolId;
    if (category)
        where.category = category;
    if (expenseStatus)
        where.status = expenseStatus;
    if (search) {
        where.OR = [
            { title: { contains: search } },
            { description: { contains: search } },
            { category: { contains: search } }
        ];
    }
    if (startDate || endDate) {
        where.expenseDate = {};
        if (startDate)
            where.expenseDate.gte = new Date(startDate);
        if (endDate)
            where.expenseDate.lte = new Date(endDate);
    }
    const [expenses, total] = await Promise.all([
        prisma.expense.findMany({
            where,
            skip,
            take: limit,
            orderBy: { expenseDate: 'desc' }
        }),
        prisma.expense.count({ where })
    ]);
    // Calculate stats
    const statsWhere = schoolId ? { schoolId } : {};
    const allExpenses = await prisma.expense.findMany({
        where: {
            ...statsWhere,
            expenseDate: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Start of current month
            }
        },
        select: { amount: true, status: true }
    });
    const totalSpending = allExpenses.reduce((sum, e) => sum + e.amount, 0);
    const approvedSpending = allExpenses.filter(e => e.status === "APPROVED").reduce((sum, e) => sum + e.amount, 0);
    SuccessResponse(res, "Expenses fetched successfully", {
        expenses,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        },
        stats: {
            monthlySpending: totalSpending,
            approvedSpending
        }
    }, status.OK);
});
/**
 * @desc Get single expense by ID
 * @route GET /api/v1/expense/:id
 * @access Private/Admin
 */
export const getExpenseById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const expense = await prisma.expense.findUnique({
        where: { id },
        include: {
            school: { select: { id: true, name: true } }
        }
    });
    if (!expense) {
        throw new ErrorResponse("Expense not found", status.Not_Found);
    }
    SuccessResponse(res, "Expense fetched successfully", expense, status.OK);
});
/**
 * @desc Update an expense
 * @route PUT /api/v1/expense/:id
 * @access Private/Admin
 */
export const updateExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = updateExpenseSchema.parse(req.body);
    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing) {
        throw new ErrorResponse("Expense not found", status.Not_Found);
    }
    const updateData = { ...data };
    if (data.expenseDate) {
        updateData.expenseDate = new Date(data.expenseDate);
    }
    const updated = await prisma.expense.update({
        where: { id },
        data: updateData
    });
    SuccessResponse(res, "Expense updated successfully", updated, status.OK);
});
/**
 * @desc Delete an expense
 * @route DELETE /api/v1/expense/:id
 * @access Private/Admin
 */
export const deleteExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) {
        throw new ErrorResponse("Expense not found", status.Not_Found);
    }
    await prisma.expense.delete({ where: { id } });
    SuccessResponse(res, "Expense deleted successfully", null, status.OK);
});
/**
 * @desc Update expense status
 * @route PATCH /api/v1/expense/:id/status
 * @access Private/Admin
 */
export const updateExpenseStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status: newStatus } = req.body;
    if (!["PENDING", "APPROVED", "REJECTED"].includes(newStatus)) {
        throw new ErrorResponse("Invalid status. Must be PENDING, APPROVED, or REJECTED", status.Bad_Request);
    }
    const existing = await prisma.expense.findUnique({ where: { id } });
    if (!existing) {
        throw new ErrorResponse("Expense not found", status.Not_Found);
    }
    const updated = await prisma.expense.update({
        where: { id },
        data: { status: newStatus }
    });
    SuccessResponse(res, "Expense status updated successfully", updated, status.OK);
});
//# sourceMappingURL=Expense.controller.js.map