import { z } from "zod";
export declare const createSubjectSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    description: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    schoolId: z.ZodString;
}, z.core.$strip>;
export declare const updateSubjectSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
}, z.core.$strip>;
export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
//# sourceMappingURL=Subject.validation.d.ts.map