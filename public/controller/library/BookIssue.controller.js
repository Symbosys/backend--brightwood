import { asyncHandler } from "../../middleware/error.middleware.js";
import { createBookIssueSchema, returnBookSchema, updateBookIssueSchema } from "../../validation/BookIssue.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode as status } from "../../types/types.js";
export const issueBook = asyncHandler(async (req, res) => {
    const data = createBookIssueSchema.parse(req.body);
    // Check if book exists and has available copies
    const book = await prisma.book.findUnique({
        where: { id: data.bookId }
    });
    if (!book) {
        throw new ErrorResponse("Book not found", status.Not_Found);
    }
    if (book.availableCopies <= 0) {
        throw new ErrorResponse("No copies available for this book", status.Bad_Request);
    }
    // Check if student exists
    const student = await prisma.student.findUnique({
        where: { id: data.studentId }
    });
    if (!student) {
        throw new ErrorResponse("Student not found", status.Not_Found);
    }
    // Use transaction to create issue and decrement copies
    const issue = await prisma.$transaction(async (tx) => {
        const newIssue = await tx.bookIssue.create({
            data: {
                bookId: data.bookId,
                studentId: data.studentId,
                dueDate: data.dueDate,
                notes: data.notes,
                status: "ISSUED"
            }
        });
        await tx.book.update({
            where: { id: data.bookId },
            data: { availableCopies: { decrement: 1 } }
        });
        return newIssue;
    });
    SuccessResponse(res, "Book issued successfully", issue, status.Created);
});
export const returnBook = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = returnBookSchema.parse(req.body);
    const issue = await prisma.bookIssue.findUnique({
        where: { id },
        include: { book: true }
    });
    if (!issue) {
        throw new ErrorResponse("Issue record not found", status.Not_Found);
    }
    if (issue.status === "RETURNED") {
        throw new ErrorResponse("Book has already been returned", status.Bad_Request);
    }
    const updatedIssue = await prisma.$transaction(async (tx) => {
        const result = await tx.bookIssue.update({
            where: { id },
            data: {
                returnDate: data.returnDate,
                status: data.status,
                fineAmount: data.fineAmount,
                notes: data.notes ? `${issue.notes || ''}\nReturn Note: ${data.notes}` : issue.notes
            }
        });
        // Only increment available copies if it wasn't lost
        if (data.status === "RETURNED") {
            await tx.book.update({
                where: { id: issue.bookId },
                data: { availableCopies: { increment: 1 } }
            });
        }
        return result;
    });
    SuccessResponse(res, "Book returned successfully", updatedIssue, status.OK);
});
export const getAllIssues = asyncHandler(async (req, res) => {
    const { studentId, bookId, status: issueStatus, page = 1, limit = 10 } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;
    const where = {};
    if (studentId)
        where.studentId = String(studentId);
    if (bookId)
        where.bookId = String(bookId);
    if (issueStatus)
        where.status = String(issueStatus);
    const [issues, total] = await Promise.all([
        prisma.bookIssue.findMany({
            where,
            skip,
            take: limitNumber,
            include: {
                book: { select: { title: true, author: true } },
                student: { select: { firstName: true, lastName: true } }
            },
            orderBy: { issueDate: 'desc' }
        }),
        prisma.bookIssue.count({ where })
    ]);
    SuccessResponse(res, "Issues fetched successfully", {
        issues,
        meta: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber)
        }
    }, status.OK);
});
export const getIssueById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const issue = await prisma.bookIssue.findUnique({
        where: { id },
        include: {
            book: true,
            student: true
        }
    });
    if (!issue) {
        throw new ErrorResponse("Issue record not found", status.Not_Found);
    }
    SuccessResponse(res, "Issue record fetched successfully", issue, status.OK);
});
export const deleteIssue = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const issue = await prisma.bookIssue.findUnique({
        where: { id }
    });
    if (!issue) {
        throw new ErrorResponse("Issue record not found", status.Not_Found);
    }
    // If an active issue is deleted, we should probably restore the book count
    await prisma.$transaction(async (tx) => {
        if (issue.status === "ISSUED" || issue.status === "OVERDUE") {
            await tx.book.update({
                where: { id: issue.bookId },
                data: { availableCopies: { increment: 1 } }
            });
        }
        await tx.bookIssue.delete({
            where: { id }
        });
    });
    SuccessResponse(res, "Issue record deleted successfully", null, status.OK);
});
//# sourceMappingURL=BookIssue.controller.js.map