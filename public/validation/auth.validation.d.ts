import z from "zod";
export declare const loginSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    password: z.ZodString;
}, z.z.core.$strip>;
export declare const registerAdminSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<{
        admin: "admin";
        super_admin: "super_admin";
        staff: "staff";
    }>>;
    schoolId: z.ZodString;
}, z.z.core.$strip>;
export declare const updateAdminSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    role: z.ZodOptional<z.ZodEnum<{
        admin: "admin";
        super_admin: "super_admin";
        staff: "staff";
    }>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, z.z.core.$strip>;
export declare const changePasswordSchema: z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
    confirmPassword: z.ZodString;
}, z.z.core.$strip>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterAdminInput = z.infer<typeof registerAdminSchema>;
export type UpdateAdminInput = z.infer<typeof updateAdminSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
//# sourceMappingURL=auth.validation.d.ts.map