import { z } from "zod";
export declare const createStudentSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    dateOfBirth: z.ZodOptional<z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>>;
    gender: z.ZodOptional<z.ZodEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
        OTHER: "OTHER";
    }>>;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    address: z.ZodOptional<z.ZodString>;
    enrollmentDate: z.ZodOptional<z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>>;
    schoolId: z.ZodString;
}, z.core.$strip>;
export declare const updateStudentSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    phone: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    address: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    dateOfBirth: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>>>;
    gender: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
        OTHER: "OTHER";
    }>>>;
    enrollmentDate: z.ZodOptional<z.ZodOptional<z.ZodPipe<z.ZodTransform<Date | undefined, unknown>, z.ZodDate>>>;
}, z.core.$strip>;
export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
//# sourceMappingURL=Student.validation.d.ts.map