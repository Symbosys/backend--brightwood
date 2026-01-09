import { z } from "zod";

export const AttendanceStatusEnum = z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]);

export const createTeacherAttendanceSchema = z.object({
    teacherId: z.string().uuid("Invalid Teacher ID"),
    date: z.preprocess((arg) => {
        if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
    }, z.date()),
    status: AttendanceStatusEnum.default("PRESENT"),
    notes: z.string().max(200).optional().or(z.literal("")),
});

export const updateTeacherAttendanceSchema = createTeacherAttendanceSchema.partial().omit({ teacherId: true, date: true });

export type CreateTeacherAttendanceInput = z.infer<typeof createTeacherAttendanceSchema>;
export type UpdateTeacherAttendanceInput = z.infer<typeof updateTeacherAttendanceSchema>;
