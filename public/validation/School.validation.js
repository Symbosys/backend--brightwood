import { z } from "zod";
export const createSchoolSchema = z.object({
    name: z
        .string()
        .min(3, { message: "School name must be at least 3 characters long" })
        .max(100, { message: "School name cannot exceed 100 characters" }),
    establishDate: z.coerce.date().optional()
        .refine((date) => !date || date <= new Date(), {
        message: "Establish date cannot be in the future",
    }),
    address: z
        .string()
        .min(5, { message: "Address must be at least 5 characters long" })
        .optional(),
    city: z
        .string()
        .min(2, { message: "City name must be at least 2 characters long" })
        .optional(),
    state: z
        .string()
        .min(2, { message: "State name must be at least 2 characters long" })
        .optional(),
    country: z
        .string()
        .min(2, { message: "Country name must be at least 2 characters long" })
        .optional(),
    postalCode: z
        .string()
        .regex(/^[a-zA-Z0-9\s-]{3,10}$/, { message: "Invalid postal code format" })
        .optional(),
    phone: z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format" })
        .optional(),
    email: z
        .string()
        .email({ message: "Invalid email address format" })
        .optional(),
    website: z
        .string()
        .url({ message: "Invalid website URL format" })
        .optional(),
});
export const updateSchoolSchema = createSchoolSchema.partial();
//# sourceMappingURL=School.validation.js.map