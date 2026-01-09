import { z } from "zod";
export declare const createFeeTypeSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    schoolId: z.ZodString;
}, z.core.$strip>;
export declare const updateFeeTypeSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=FeeType.validation.d.ts.map