import { z } from "zod";
export declare const createFeeStructureSchema: z.ZodObject<{
    feeTypeId: z.ZodString;
    academicYearId: z.ZodString;
    classId: z.ZodString;
    amount: z.ZodNumber;
    dueDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
    schoolId: z.ZodString;
}, z.core.$strip>;
export declare const updateFeeStructureSchema: z.ZodObject<{
    academicYearId: z.ZodOptional<z.ZodString>;
    classId: z.ZodOptional<z.ZodString>;
    amount: z.ZodOptional<z.ZodNumber>;
    dueDate: z.ZodOptional<z.ZodOptional<z.ZodCoercedDate<unknown>>>;
    feeTypeId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=FeeStructure.validation.d.ts.map