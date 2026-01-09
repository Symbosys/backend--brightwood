import { z } from "zod";
const examBaseSchema = z.object({
    name: z.string().max(100).optional().or(z.literal("")),
    examTermId: z.string().uuid("Invalid Exam Term ID"),
    subjectId: z.string().uuid("Invalid Subject ID"),
    classId: z.string().uuid("Invalid Class ID"),
    date: z
        .preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date)
            return new Date(arg);
    }, z.date())
        .optional(),
    startTime: z
        .string()
        .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i, "Invalid time format (e.g., 09:00 AM)")
        .optional()
        .or(z.literal("")),
    endTime: z
        .string()
        .regex(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s(AM|PM)$/i, "Invalid time format (e.g., 12:00 PM)")
        .optional()
        .or(z.literal("")),
    maxMarks: z.number().min(0, "Max marks must be a positive number"),
    passingMarks: z.number().min(0, "Passing marks must be a positive number"),
});
export const createExamSchema = examBaseSchema.refine((data) => data.passingMarks <= data.maxMarks, {
    message: "Passing marks cannot be greater than maximum marks",
    path: ["passingMarks"],
});
export const updateExamSchema = examBaseSchema.partial().omit({
    examTermId: true,
    subjectId: true,
    classId: true
}).refine((data) => {
    if (data.passingMarks !== undefined && data.maxMarks !== undefined) {
        return data.passingMarks <= data.maxMarks;
    }
    return true;
}, {
    message: "Passing marks cannot be greater than maximum marks",
    path: ["passingMarks"],
});
//# sourceMappingURL=Exam.validation.js.map