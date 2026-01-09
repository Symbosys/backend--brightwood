import z from "zod";
export declare const createSectionSchema: z.ZodObject<{
    name: z.ZodString;
    capacity: z.ZodOptional<z.ZodNumber>;
    classId: z.ZodString;
    classTeacherId: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
export declare const updateSectionSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    capacity: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    classTeacherId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.z.core.$strip>;
//# sourceMappingURL=Section.validation.d.ts.map