import { z } from "zod";

export const AttendanceStatusEnum = z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]);

export const createAttendanceSchema = z.object({
    studentId: z.string().uuid("Invalid Student ID"),
    enrollmentId: z.string().uuid("Invalid Enrollment ID").optional().or(z.literal("")),
    date: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date()),
    status: AttendanceStatusEnum.default("PRESENT"),
    notes: z.string().max(200).optional().or(z.literal("")),
});

export const bulkAttendanceSchema = z.object({
    date: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date()),
    records: z.array(z.object({
        studentId: z.string().uuid("Invalid Student ID"),
        enrollmentId: z.string().uuid("Invalid Enrollment ID").optional().or(z.literal("")),
        status: AttendanceStatusEnum,
        notes: z.string().max(200).optional().or(z.literal("")),
    })).min(1, "At least one attendance record is required"),
});

export const updateAttendanceSchema = createAttendanceSchema.partial().omit({ studentId: true, date: true });

export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type BulkAttendanceInput = z.infer<typeof bulkAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
