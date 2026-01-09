import { z } from "zod";
export declare const FeeStatusEnum: z.ZodEnum<{
    OVERDUE: "OVERDUE";
    UNPAID: "UNPAID";
    PARTIAL: "PARTIAL";
    PAID: "PAID";
}>;
export declare const createStudentFeeSchema: z.ZodObject<{
    studentId: z.ZodString;
    feeStructureId: z.ZodString;
    amount: z.ZodOptional<z.ZodNumber>;
    discount: z.ZodDefault<z.ZodNumber>;
    dueDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    status: z.ZodDefault<z.ZodEnum<{
        OVERDUE: "OVERDUE";
        UNPAID: "UNPAID";
        PARTIAL: "PARTIAL";
        PAID: "PAID";
    }>>;
}, z.core.$strip>;
export declare const updateStudentFeeSchema: z.ZodObject<{
    studentId: z.ZodOptional<z.ZodString>;
    feeStructureId: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    discount: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    dueDate: z.ZodOptional<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        OVERDUE: "OVERDUE";
        UNPAID: "UNPAID";
        PARTIAL: "PARTIAL";
        PAID: "PAID";
    }>>>;
}, z.core.$strip>;
//# sourceMappingURL=StudentFee.validation.d.ts.map