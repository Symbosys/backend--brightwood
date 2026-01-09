import { z } from "zod";
export declare const createExamSchema: z.ZodObject<{
    name: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    examTermId: z.ZodString;
    subjectId: z.ZodString;
    classId: z.ZodString;
    date: z.ZodOptional<z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>>;
    startTime: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    endTime: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    maxMarks: z.ZodNumber;
    passingMarks: z.ZodNumber;
}, z.core.$strip>;
export declare const updateExamSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    date: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>>>;
    startTime: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    endTime: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    maxMarks: z.ZodOptional<z.ZodNumber>;
    passingMarks: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CreateExamInput = z.infer<typeof createExamSchema>;
export type UpdateExamInput = z.infer<typeof updateExamSchema>;
//# sourceMappingURL=Exam.validation.d.ts.map