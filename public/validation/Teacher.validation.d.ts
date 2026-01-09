import z from "zod";
export declare const createTeacherSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    hireDate: z.ZodNullable<z.ZodOptional<z.z.ZodCoercedDate<unknown>>>;
    schoolId: z.ZodString;
}, z.z.core.$strip>;
export declare const updateTeacherSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    hireDate: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.z.ZodCoercedDate<unknown>>>>;
}, z.z.core.$strip>;
//# sourceMappingURL=Teacher.validation.d.ts.map