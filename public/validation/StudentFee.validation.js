import { z } from "zod";
export const FeeStatusEnum = z.enum(["UNPAID", "PARTIAL", "PAID", "OVERDUE"]);
export const createStudentFeeSchema = z.object({
    studentId: z.string().uuid("Invalid student ID"),
    feeStructureId: z.string().uuid("Invalid fee structure ID"),
    amount: z.number().min(0, "Amount cannot be negative").optional(),
    discount: z.number().min(0, "Discount cannot be negative").default(0),
    dueDate: z.coerce.date().optional(),
    status: FeeStatusEnum.default("UNPAID"),
});
export const updateStudentFeeSchema = createStudentFeeSchema.partial();
//# sourceMappingURL=StudentFee.validation.js.map