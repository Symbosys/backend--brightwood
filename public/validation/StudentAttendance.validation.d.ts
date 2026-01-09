import { z } from "zod";
export declare const AttendanceStatusEnum: z.ZodEnum<{
    PRESENT: "PRESENT";
    ABSENT: "ABSENT";
    LATE: "LATE";
    EXCUSED: "EXCUSED";
}>;
export declare const createAttendanceSchema: z.ZodObject<{
    studentId: z.ZodString;
    enrollmentId: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    date: z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>;
    status: z.ZodDefault<z.ZodEnum<{
        PRESENT: "PRESENT";
        ABSENT: "ABSENT";
        LATE: "LATE";
        EXCUSED: "EXCUSED";
    }>>;
    notes: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
}, z.core.$strip>;
export declare const bulkAttendanceSchema: z.ZodObject<{
    date: z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>;
    records: z.ZodArray<z.ZodObject<{
        studentId: z.ZodString;
        enrollmentId: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
        status: z.ZodEnum<{
            PRESENT: "PRESENT";
            ABSENT: "ABSENT";
            LATE: "LATE";
            EXCUSED: "EXCUSED";
        }>;
        notes: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const updateAttendanceSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        PRESENT: "PRESENT";
        ABSENT: "ABSENT";
        LATE: "LATE";
        EXCUSED: "EXCUSED";
    }>>>;
    enrollmentId: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    notes: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
}, z.core.$strip>;
export type CreateAttendanceInput = z.infer<typeof createAttendanceSchema>;
export type BulkAttendanceInput = z.infer<typeof bulkAttendanceSchema>;
export type UpdateAttendanceInput = z.infer<typeof updateAttendanceSchema>;
//# sourceMappingURL=StudentAttendance.validation.d.ts.map