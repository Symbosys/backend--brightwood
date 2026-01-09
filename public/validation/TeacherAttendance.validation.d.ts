import { z } from "zod";
export declare const AttendanceStatusEnum: z.ZodEnum<{
    PRESENT: "PRESENT";
    ABSENT: "ABSENT";
    LATE: "LATE";
    EXCUSED: "EXCUSED";
}>;
export declare const createTeacherAttendanceSchema: z.ZodObject<{
    teacherId: z.ZodString;
    date: z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>;
    status: z.ZodDefault<z.ZodEnum<{
        PRESENT: "PRESENT";
        ABSENT: "ABSENT";
        LATE: "LATE";
        EXCUSED: "EXCUSED";
    }>>;
    notes: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export declare const updateTeacherAttendanceSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        PRESENT: "PRESENT";
        ABSENT: "ABSENT";
        LATE: "LATE";
        EXCUSED: "EXCUSED";
    }>>>;
    notes: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
}, z.core.$strip>;
export type CreateTeacherAttendanceInput = z.infer<typeof createTeacherAttendanceSchema>;
export type UpdateTeacherAttendanceInput = z.infer<typeof updateTeacherAttendanceSchema>;
//# sourceMappingURL=TeacherAttendance.validation.d.ts.map