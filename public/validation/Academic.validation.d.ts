import z from "zod";
export declare const AcademicValidation: z.ZodObject<{
    name: z.ZodString;
    startDate: z.z.ZodCoercedDate<unknown>;
    endDate: z.z.ZodCoercedDate<unknown>;
    schoolId: z.ZodString;
}, z.z.core.$strip>;
//# sourceMappingURL=Academic.validation.d.ts.map