import { z } from "zod";

export const createFeeTypeSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    description: z.string().max(255).optional(),
    schoolId: z.string().uuid("Invalid school ID"),
});

export const updateFeeTypeSchema = createFeeTypeSchema.partial().omit({ schoolId: true });
