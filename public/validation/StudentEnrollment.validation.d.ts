import { z } from "zod";
export declare const createEnrollmentSchema: z.ZodObject<{
    studentId: z.ZodString;
    sectionId: z.ZodString;
    academicYearId: z.ZodString;
    enrollmentDate: z.ZodOptional<z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>>;
    status: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const updateEnrollmentSchema: z.ZodObject<{
    sectionId: z.ZodOptional<z.ZodString>;
    academicYearId: z.ZodOptional<z.ZodString>;
    enrollmentDate: z.ZodOptional<z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>>;
    status: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CreateEnrollmentInput = z.infer<typeof createEnrollmentSchema>;
export type UpdateEnrollmentInput = z.infer<typeof updateEnrollmentSchema>;
//# sourceMappingURL=StudentEnrollment.validation.d.ts.map