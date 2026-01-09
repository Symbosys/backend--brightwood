import { z } from "zod";
export const createFeeStructureSchema = z.object({
    feeTypeId: z.string().uuid("Invalid fee type ID"),
    academicYearId: z.string().uuid("Invalid academic year ID"),
    classId: z.string().uuid("Invalid class ID"),
    amount: z.number().positive("Amount must be greater than 0"),
    dueDate: z.coerce.date().optional(),
    schoolId: z.string().uuid("Invalid school ID"),
});
export const updateFeeStructureSchema = createFeeStructureSchema.partial().omit({ schoolId: true });
//# sourceMappingURL=FeeStructure.validation.js.map