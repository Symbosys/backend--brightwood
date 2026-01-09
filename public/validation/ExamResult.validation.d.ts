import { z } from "zod";
export declare const createExamResultSchema: z.ZodObject<{
    examId: z.ZodString;
    studentId: z.ZodString;
    marksObtained: z.ZodNumber;
    remarks: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    absent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export declare const bulkExamResultSchema: z.ZodObject<{
    examId: z.ZodString;
    results: z.ZodArray<z.ZodObject<{
        studentId: z.ZodString;
        marksObtained: z.ZodNumber;
        remarks: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        absent: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const updateExamResultSchema: z.ZodObject<{
    marksObtained: z.ZodOptional<z.ZodNumber>;
    remarks: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    absent: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodBoolean>>>;
}, z.core.$strip>;
export type CreateExamResultInput = z.infer<typeof createExamResultSchema>;
export type BulkExamResultInput = z.infer<typeof bulkExamResultSchema>;
export type UpdateExamResultInput = z.infer<typeof updateExamResultSchema>;
//# sourceMappingURL=ExamResult.validation.d.ts.map