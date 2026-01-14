import { z } from "zod";

export const createExpenseSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
    description: z.string().max(1000, "Description must be less than 1000 characters").optional(),
    category: z.string().min(1, "Category is required").max(50, "Category must be less than 50 characters"),
    amount: z.number().positive("Amount must be greater than 0"),
    expenseDate: z.string().datetime().optional().or(z.date()),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    receiptUrl: z.string().url("Invalid receipt URL").optional().or(z.literal("")),
    notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
    schoolId: z.string().uuid("Invalid school ID"),
});

export const updateExpenseSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters").optional(),
    description: z.string().max(1000, "Description must be less than 1000 characters").optional().nullable(),
    category: z.string().min(1, "Category is required").max(50, "Category must be less than 50 characters").optional(),
    amount: z.number().positive("Amount must be greater than 0").optional(),
    expenseDate: z.string().datetime().optional().or(z.date()),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    receiptUrl: z.string().url("Invalid receipt URL").optional().nullable().or(z.literal("")),
    notes: z.string().max(500, "Notes must be less than 500 characters").optional().nullable(),
});

export const expenseQuerySchema = z.object({
    schoolId: z.string().uuid().optional(),
    category: z.string().optional(),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    search: z.string().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
});

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
export type ExpenseQueryInput = z.infer<typeof expenseQuerySchema>;
