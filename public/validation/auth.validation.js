import z from "zod";
// Login validation schema
export const loginSchema = z.object({
    email: z
        .string()
        .email({ message: "Please enter a valid email address" })
        .transform(val => val.toLowerCase().trim()),
    password: z
        .string()
        .min(1, { message: "Password is required" }),
});
// Register admin validation schema
export const registerAdminSchema = z.object({
    firstName: z
        .string()
        .min(2, { message: "First name must be at least 2 characters" })
        .max(50, { message: "First name must be less than 50 characters" }),
    lastName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters" })
        .max(50, { message: "Last name must be less than 50 characters" }),
    email: z
        .string()
        .email({ message: "Please enter a valid email address" })
        .transform(val => val.toLowerCase().trim()),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(100, { message: "Password must be less than 100 characters" }),
    role: z
        .enum(["super_admin", "admin", "staff"])
        .default("admin"),
    schoolId: z
        .string()
        .uuid({ message: "Invalid school ID format" }),
});
// Update admin validation schema
export const updateAdminSchema = z.object({
    firstName: z
        .string()
        .min(2, { message: "First name must be at least 2 characters" })
        .max(50, { message: "First name must be less than 50 characters" })
        .optional(),
    lastName: z
        .string()
        .min(2, { message: "Last name must be at least 2 characters" })
        .max(50, { message: "Last name must be less than 50 characters" })
        .optional(),
    email: z
        .string()
        .email({ message: "Please enter a valid email address" })
        .transform(val => val.toLowerCase().trim())
        .optional(),
    role: z
        .enum(["super_admin", "admin", "staff"])
        .optional(),
    isActive: z
        .boolean()
        .optional(),
});
// Change password validation schema
export const changePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, { message: "Current password is required" }),
    newPassword: z
        .string()
        .min(6, { message: "New password must be at least 6 characters" })
        .max(100, { message: "New password must be less than 100 characters" }),
    confirmPassword: z
        .string()
        .min(1, { message: "Confirm password is required" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
//# sourceMappingURL=auth.validation.js.map