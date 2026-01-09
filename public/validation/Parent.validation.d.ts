import { z } from "zod";
export declare const ParentRelationshipEnum: z.ZodEnum<{
    OTHER: "OTHER";
    MOTHER: "MOTHER";
    FATHER: "FATHER";
    GUARDIAN: "GUARDIAN";
}>;
export declare const createParentSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    parentsLoginId: z.ZodString;
    email: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    phone: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    address: z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>;
    relationship: z.ZodOptional<z.ZodEnum<{
        OTHER: "OTHER";
        MOTHER: "MOTHER";
        FATHER: "FATHER";
        GUARDIAN: "GUARDIAN";
    }>>;
    studentIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
    password: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateParentSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    parentsLoginId: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    phone: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    address: z.ZodOptional<z.ZodUnion<[z.ZodOptional<z.ZodString>, z.ZodLiteral<"">]>>;
    relationship: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
        OTHER: "OTHER";
        MOTHER: "MOTHER";
        FATHER: "FATHER";
        GUARDIAN: "GUARDIAN";
    }>>>;
    studentIds: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    password: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export type CreateParentInput = z.infer<typeof createParentSchema>;
export type UpdateParentInput = z.infer<typeof updateParentSchema>;
//# sourceMappingURL=Parent.validation.d.ts.map