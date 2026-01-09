import { z } from "zod";
export declare const createBookSchema: z.ZodObject<{
    title: z.ZodString;
    author: z.ZodOptional<z.ZodString>;
    isbn: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    publisher: z.ZodOptional<z.ZodString>;
    edition: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    totalCopies: z.ZodDefault<z.ZodNumber>;
    availableCopies: z.ZodOptional<z.ZodNumber>;
    schoolId: z.ZodString;
}, z.core.$strip>;
export declare const updateBookSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    title: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isbn: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    category: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    publisher: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    edition: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    totalCopies: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    availableCopies: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
}, z.core.$strip>;
//# sourceMappingURL=Book.validation.d.ts.map