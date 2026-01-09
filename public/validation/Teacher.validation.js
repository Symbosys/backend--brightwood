import z from "zod";
export const createTeacherSchema = z.object({
    firstName: z
        .string()
        .min(2, { message: "First name must be at least 2 characters long" })
        .max(50, { message: "First name cannot exceed 50 characters" }),
    lastName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters long" })
        .max(50, { message: "Last name cannot exceed 50 characters" }),
    email: z
        .string()
        .email({ message: "Invalid email address format" }),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" })
        .optional()
        .nullable(),
    hireDate: z.coerce.date().optional().nullable()
        .refine((date) => !date || date <= new Date(), {
        message: "Hire date cannot be in the future",
    }),
    schoolId: z
        .string()
        .uuid({ message: "Invalid School ID format" }),
});
export const updateTeacherSchema = createTeacherSchema.partial().omit({ schoolId: true });
//# sourceMappingURL=Teacher.validation.js.map