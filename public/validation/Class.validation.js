import z from "zod";
export const createClassSchema = z.object({
    name: z
        .string()
        .min(1, { message: "Class name is required" })
        .max(50, { message: "Class name cannot exceed 50 characters" }),
    gradeLevel: z
        .string()
        .max(20, { message: "Grade level cannot exceed 20 characters" })
        .optional(),
    schoolId: z
        .string()
        .uuid({ message: "Invalid School ID format" }),
});
export const updateClassSchema = createClassSchema.partial().omit({ schoolId: true });
//# sourceMappingURL=Class.validation.js.map