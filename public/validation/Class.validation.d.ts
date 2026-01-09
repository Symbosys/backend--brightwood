import z from "zod";
export declare const createClassSchema: z.ZodObject<{
    name: z.ZodString;
    gradeLevel: z.ZodOptional<z.ZodString>;
    schoolId: z.ZodString;
}, z.z.core.$strip>;
export declare const updateClassSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    gradeLevel: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.z.core.$strip>;
//# sourceMappingURL=Class.validation.d.ts.map