import { z } from "zod";

const bookBaseSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    author: z.string().max(255).optional(),
    isbn: z.string().max(50).optional(),
    category: z.string().max(100).optional(),
    publisher: z.string().max(255).optional(),
    edition: z.string().max(50).optional(),
    description: z.string().optional(),
    totalCopies: z.number().int().min(0).default(1),
    availableCopies: z.number().int().min(0).optional(),
    schoolId: z.string().uuid("Invalid school ID"),
});

export const createBookSchema = bookBaseSchema.refine((data) => {
    if (data.availableCopies !== undefined && data.availableCopies > data.totalCopies) {
        return false;
    }
    return true;
}, {
    message: "Available copies cannot exceed total copies",
    path: ["availableCopies"],
});

export const updateBookSchema = bookBaseSchema.partial().omit({ schoolId: true });
