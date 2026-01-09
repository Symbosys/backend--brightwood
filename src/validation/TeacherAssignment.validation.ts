import { z } from "zod";

export const createAssignmentSchema = z.object({
    teacherId: z.string().uuid("Invalid Teacher ID"),
    subjectId: z.string().uuid("Invalid Subject ID"),
    sectionId: z.string().uuid("Invalid Section ID"),
    academicYearId: z.string().uuid("Invalid Academic Year ID").optional().or(z.literal("")),
    assignedAt: z
        .preprocess((arg) => {
            if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
        }, z.date())
        .optional(),
});

export const updateAssignmentSchema = createAssignmentSchema.partial();

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
