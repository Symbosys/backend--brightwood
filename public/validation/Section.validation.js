import z from "zod";
export const createSectionSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Section name is required" })
        .max(50, { message: "Section name cannot exceed 50 characters" }),
    capacity: z
        .number()
        .int({ message: "Capacity must be an integer" })
        .positive({ message: "Capacity must be a positive number" })
        .optional(),
    classId: z
        .string()
        .uuid({ message: "Invalid Class ID format" }),
    classTeacherId: z
        .string()
        .uuid({ message: "Invalid Teacher ID format" })
        .optional(),
});
export const updateSectionSchema = createSectionSchema.partial().omit({ classId: true });
//# sourceMappingURL=Section.validation.js.map