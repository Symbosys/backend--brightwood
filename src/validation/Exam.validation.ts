import { z } from "zod";

const examBaseSchema = z.object({
    name: z.string().max(100).optional().or(z.literal("")),
    examTermId: z.string().uuid("Invalid Exam Term ID"),
    subjectId: z.string().uuid("Invalid Subject ID"),
    classId: z.string().uuid("Invalid Class ID"),
    date: z
        .preprocess((arg) => {
            if (typeof arg === "string") {
                const parsed = new Date(arg);
                return isNaN(parsed.getTime()) ? undefined : parsed;
            }
            if (arg instanceof Date) return arg;
            return undefined;
        }, z.date()).describe("Invalid date format (e.g., 2024-01-15)"),
    startTime: z
        .string()
        .regex(/^((0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)|([01]?[0-9]|2[0-3]):[0-5][0-9])$/, "Invalid time format (e.g., 09:00 AM or 09:00)")
        .optional()
        .or(z.literal("")),
    endTime: z
        .string()
        .regex(/^((0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM|am|pm)|([01]?[0-9]|2[0-3]):[0-5][0-9])$/, "Invalid time format (e.g., 12:00 PM or 14:00)")
        .optional()
        .or(z.literal("")),
    maxMarks: z.coerce.number().min(0, "Max marks must be a positive number"),
    passingMarks: z.coerce.number().min(0, "Passing marks must be a positive number"),
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

export type CreateExamInput = z.infer<typeof createExamSchema>;
export type UpdateExamInput = z.infer<typeof updateExamSchema>;
