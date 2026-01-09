import { z } from "zod";
export declare const createAssignmentSchema: z.ZodObject<{
    teacherId: z.ZodString;
    subjectId: z.ZodString;
    sectionId: z.ZodString;
    academicYearId: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    assignedAt: z.ZodOptional<z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>>;
}, z.core.$strip>;
export declare const updateAssignmentSchema: z.ZodObject<{
    teacherId: z.ZodOptional<z.ZodString>;
    subjectId: z.ZodOptional<z.ZodString>;
    sectionId: z.ZodOptional<z.ZodString>;
    academicYearId: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    assignedAt: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>>>;
}, z.core.$strip>;
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
//# sourceMappingURL=TeacherAssignment.validation.d.ts.map