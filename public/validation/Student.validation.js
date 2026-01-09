import { z } from "zod";
export const createStudentSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name cannot exceed 50 characters")
        .trim(),
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name cannot exceed 50 characters")
        .trim(),
    loginId: z
        .string()
        .min(3, "Login ID must be at least 3 characters")
        .max(50, "Login ID cannot exceed 50 characters")
        .trim(),
    dateOfBirth: z
        .preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date)
            return new Date(arg);
    }, z.date())
        .optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    email: z
        .string()
        .email("Invalid email address")
        .toLowerCase()
        .trim()
        .optional()
        .or(z.literal("")),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
        .optional()
        .or(z.literal("")),
    address: z.string().max(255).optional(),
    enrollmentDate: z
        .preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date)
            return new Date(arg);
    }, z.date())
        .optional(),
    schoolId: z.string().uuid("Invalid School ID"),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
});
export const updateStudentSchema = createStudentSchema.partial().omit({ schoolId: true });
//# sourceMappingURL=Student.validation.js.map