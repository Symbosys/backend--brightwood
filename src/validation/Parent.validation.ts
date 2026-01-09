import { z } from "zod";

export const ParentRelationshipEnum = z.enum(["MOTHER", "FATHER", "GUARDIAN", "OTHER"]);

export const createParentSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(50, "First name cannot exceed 50 characters")
        .trim(),
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(50, "Last name cannot exceed 50 characters")
        .trim(),
    parentsLoginId: z
        .string()
        .min(3, "Parent Login ID must be at least 3 characters")
        .max(50, "Parent Login ID cannot exceed 50 characters")
        .trim(),
    email: z
        .string()
        .email("Invalid email address")
        .toLowerCase()
        .trim()
        .optional()
        .or(z.literal("")),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
        .optional()
        .or(z.literal("")),
    address: z
        .string()
        .max(255, "Address cannot exceed 255 characters")
        .optional()
        .or(z.literal("")),
    relationship: ParentRelationshipEnum.optional(),
    studentIds: z.array(z.string().uuid("Invalid Student ID")).optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional(),
});

export const updateParentSchema = createParentSchema.partial();

export type CreateParentInput = z.infer<typeof createParentSchema>;
export type UpdateParentInput = z.infer<typeof updateParentSchema>;
