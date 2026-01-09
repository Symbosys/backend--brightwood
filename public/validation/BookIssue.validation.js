import { z } from "zod";
export const IssueStatusEnum = z.enum(["ISSUED", "RETURNED", "OVERDUE", "LOST"]);
export const createBookIssueSchema = z.object({
    bookId: z.string().uuid("Invalid book ID"),
    studentId: z.string().uuid("Invalid student ID"),
    dueDate: z.coerce.date().refine((date) => date > new Date(), {
        message: "Due date must be in the future",
    }),
    notes: z.string().optional(),
});
export const returnBookSchema = z.object({
    returnDate: z.coerce.date().default(() => new Date()),
    status: z.enum(["RETURNED", "LOST"]).default("RETURNED"),
    fineAmount: z.number().min(0).default(0),
    notes: z.string().optional(),
});
export const updateBookIssueSchema = createBookIssueSchema.partial().extend({
    status: IssueStatusEnum.optional(),
    fineAmount: z.number().min(0).optional(),
    returnDate: z.coerce.date().optional(),
});
//# sourceMappingURL=BookIssue.validation.js.map