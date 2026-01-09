import { z } from "zod";

export const createFeePaymentSchema = z.object({
    studentFeeId: z.string().uuid("Invalid student fee ID format"),
    amount: z.number().positive("Payment amount must be greater than 0"),
    paymentDate: z.coerce.date().default(() => new Date()),
    paymentMethod: z.string().min(1, "Payment method is required"),
    transactionId: z.string().optional(),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const updateFeePaymentSchema = createFeePaymentSchema.partial();

export const feePaymentQuerySchema = z.object({
    studentFeeId: z.string().uuid().optional(),
    paymentMethod: z.string().optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
});
