import { z } from "zod";
export const createEnrollmentSchema = z.object({
    studentId: z.string().uuid("Invalid Student ID"),
    sectionId: z.string().uuid("Invalid Section ID"),
    academicYearId: z.string().uuid("Invalid Academic Year ID"),
    enrollmentDate: z
        .preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date)
            return new Date(arg);
    }, z.date())
        .optional(),
    status: z.string().max(20).optional().default("Active"),
});
export const updateEnrollmentSchema = z.object({
    sectionId: z.string().uuid("Invalid Section ID").optional(),
    academicYearId: z.string().uuid("Invalid Academic Year ID").optional(),
    enrollmentDate: z
        .preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date)
            return new Date(arg);
    }, z.date())
        .optional(),
    status: z.string().max(20).optional(),
});
//# sourceMappingURL=StudentEnrollment.validation.js.map