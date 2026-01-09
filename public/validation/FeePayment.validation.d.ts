import { z } from "zod";
export declare const createFeePaymentSchema: z.ZodObject<{
    studentFeeId: z.ZodString;
    amount: z.ZodNumber;
    paymentDate: z.ZodDefault<z.ZodCoercedDate<unknown>>;
    paymentMethod: z.ZodString;
    transactionId: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateFeePaymentSchema: z.ZodObject<{
    studentFeeId: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
    paymentDate: z.ZodOptional<z.ZodDefault<z.ZodCoercedDate<unknown>>>;
    paymentMethod: z.ZodOptional<z.ZodString>;
    transactionId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const feePaymentQuerySchema: z.ZodObject<{
    studentFeeId: z.ZodOptional<z.ZodString>;
    paymentMethod: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    endDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    page: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
//# sourceMappingURL=FeePayment.validation.d.ts.map