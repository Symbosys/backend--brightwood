import { z } from "zod";
export declare const createExamTermSchema: z.ZodObject<{
    name: z.ZodString;
    academicYearId: z.ZodString;
    schoolId: z.ZodString;
    startDate: z.ZodOptional<z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>>;
    endDate: z.ZodOptional<z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>>;
}, z.core.$strip>;
export declare const updateExamTermSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    startDate: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>>>;
    endDate: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>>>;
}, z.core.$strip>;
export type CreateExamTermInput = z.infer<typeof createExamTermSchema>;
export type UpdateExamTermInput = z.infer<typeof updateExamTermSchema>;
//# sourceMappingURL=ExamTerm.validation.d.ts.map