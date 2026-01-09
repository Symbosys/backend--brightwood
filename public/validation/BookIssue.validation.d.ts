import { z } from "zod";
export declare const IssueStatusEnum: z.ZodEnum<{
    ISSUED: "ISSUED";
    RETURNED: "RETURNED";
    OVERDUE: "OVERDUE";
    LOST: "LOST";
}>;
export declare const createBookIssueSchema: z.ZodObject<{
    bookId: z.ZodString;
    studentId: z.ZodString;
    dueDate: z.ZodCoercedDate<unknown>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const returnBookSchema: z.ZodObject<{
    returnDate: z.ZodDefault<z.ZodCoercedDate<unknown>>;
    status: z.ZodDefault<z.ZodEnum<{
        RETURNED: "RETURNED";
        LOST: "LOST";
    }>>;
    fineAmount: z.ZodDefault<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateBookIssueSchema: z.ZodObject<{
    bookId: z.ZodOptional<z.ZodString>;
    studentId: z.ZodOptional<z.ZodString>;
    dueDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    notes: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    status: z.ZodOptional<z.ZodEnum<{
        ISSUED: "ISSUED";
        RETURNED: "RETURNED";
        OVERDUE: "OVERDUE";
        LOST: "LOST";
    }>>;
    fineAmount: z.ZodOptional<z.ZodNumber>;
    returnDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
//# sourceMappingURL=BookIssue.validation.d.ts.map