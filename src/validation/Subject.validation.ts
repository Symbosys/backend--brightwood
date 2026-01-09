import { z } from "zod";

export const createSubjectSchema = z.object({
    name: z
        .string()
        .min(2, "Subject name must be at least 2 characters")
        .max(100, "Subject name cannot exceed 100 characters")
        .trim(),
    code: z
        .string()
        .min(2, "Subject code must be at least 2 characters")
        .max(20, "Subject code cannot exceed 20 characters")
        .toUpperCase()
        .trim()
        .optional()
        .or(z.literal("")),
    description: z
        .string()
        .max(500, "Description cannot exceed 500 characters")
        .optional()
        .or(z.literal("")),
    schoolId: z.string().uuid("Invalid School ID"),
});

export const updateSubjectSchema = createSubjectSchema.partial().omit({ schoolId: true });

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
