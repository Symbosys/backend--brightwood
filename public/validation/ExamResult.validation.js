import { z } from "zod";
export const createExamResultSchema = z.object({
    examId: z.string().uuid("Invalid Exam ID"),
    studentId: z.string().uuid("Invalid Student ID"),
    marksObtained: z.number().min(0, "Marks must be a positive number"),
    remarks: z.string().max(200).optional().or(z.literal("")),
    absent: z.boolean().optional().default(false),
});
export const bulkExamResultSchema = z.object({
    examId: z.string().uuid("Invalid Exam ID"),
    results: z.array(z.object({
        studentId: z.string().uuid("Invalid Student ID"),
        marksObtained: z.number().min(0, "Marks must be a positive number"),
        remarks: z.string().max(200).optional().or(z.literal("")),
        absent: z.boolean().optional().default(false),
    })).min(1, "At least one result record is required"),
});
export const updateExamResultSchema = createExamResultSchema.partial().omit({ examId: true, studentId: true });
//# sourceMappingURL=ExamResult.validation.js.map