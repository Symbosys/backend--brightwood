import { z } from "zod";
const examTermBaseSchema = z.object({
    name: z
        .string()
        .min(2, "Term name must be at least 2 characters")
        .max(50, "Term name cannot exceed 50 characters")
        .trim(),
    academicYearId: z.string().uuid("Invalid Academic Year ID"),
    schoolId: z.string().uuid("Invalid School ID"),
    startDate: z
        .preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date)
            return new Date(arg);
    }, z.date())
        .optional(),
    endDate: z
        .preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date)
            return new Date(arg);
    }, z.date())
        .optional(),
    isActive: z.boolean().optional(),
});
export const createExamTermSchema = examTermBaseSchema.refine((data) => {
    if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
    }
    return true;
}, {
    message: "End date must be after start date",
    path: ["endDate"],
});
export const updateExamTermSchema = examTermBaseSchema.partial().omit({ schoolId: true }).refine((data) => {
    if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
    }
    return true;
}, {
    message: "End date must be after start date",
    path: ["endDate"],
});
//# sourceMappingURL=ExamTerm.validation.js.map