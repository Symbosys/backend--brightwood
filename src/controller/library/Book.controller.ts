import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { createBookSchema, updateBookSchema } from "../../validation/Book.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode as status } from "../../types/types.js";

export const createBook = asyncHandler(async (req: Request, res: Response) => {
    const data = createBookSchema.parse(req.body);

    // Check if school exists
    const school = await prisma.school.findUnique({
        where: { id: data.schoolId }
    });

    if (!school) {
        throw new ErrorResponse("School not found", status.Not_Found);
    }

    // Check if ISBN already exists if provided
    if (data.isbn) {
        const existingBook = await prisma.book.findUnique({
            where: { isbn: data.isbn }
        });
        if (existingBook) {
            throw new ErrorResponse("Book with this ISBN already exists", status.Conflict);
        }
    }

    // Default availableCopies to totalCopies if not provided
    if (data.availableCopies === undefined) {
        data.availableCopies = data.totalCopies;
    }

    const book = await prisma.book.create({
        data
    });

    SuccessResponse(res, "Book created successfully", book, status.Created);
});

export const getAllBooks = asyncHandler(async (req: Request, res: Response) => {
    const { schoolId, search, category, page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = {};

    if (schoolId) where.schoolId = String(schoolId);
    if (category) where.category = String(category);
    if (search) {
        where.OR = [
            { title: { contains: String(search) } },
            { author: { contains: String(search) } },
            { isbn: { contains: String(search) } }
        ];
    }

    const [books, total] = await Promise.all([
        prisma.book.findMany({
            where,
            skip,
            take: limitNumber,
            orderBy: { title: 'asc' }
        }),
        prisma.book.count({ where })
    ]);

    SuccessResponse(res, "Books fetched successfully", {
        books,
        meta: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber)
        }
    }, status.OK);
});

export const getBookById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
        where: { id },
        include: {
            school: {
                select: { name: true }
            }
        }
    });

    if (!book) {
        throw new ErrorResponse("Book not found", status.Not_Found);
    }

    SuccessResponse(res, "Book fetched successfully", book, status.OK);
});

export const updateBook = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = updateBookSchema.parse(req.body);

    const existingBook = await prisma.book.findUnique({
        where: { id }
    });

    if (!existingBook) {
        throw new ErrorResponse("Book not found", status.Not_Found);
    }

    // Check ISBN uniqueness if updated
    if (data.isbn && data.isbn !== existingBook.isbn) {
        const isbnExists = await prisma.book.findUnique({
            where: { isbn: data.isbn }
        });
        if (isbnExists) {
            throw new ErrorResponse("Another book with this ISBN already exists", status.Conflict);
        }
    }

    // Business logic: if totalCopies is decreased, ensure availableCopies is adjusted if needed
    // This is a simple implementation, real logic might be more complex if books are out
    if (data.totalCopies !== undefined) {
        const diff = data.totalCopies - existingBook.totalCopies;
        if (data.availableCopies === undefined) {
            data.availableCopies = existingBook.availableCopies + diff;
            if (data.availableCopies < 0) data.availableCopies = 0;
        }
    }

    const updatedBook = await prisma.book.update({
        where: { id },
        data
    });

    SuccessResponse(res, "Book updated successfully", updatedBook, status.OK);
});

export const deleteBook = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
        where: { id },
        include: { _count: { select: { issues: true } } }
    });

    if (!book) {
        throw new ErrorResponse("Book not found", status.Not_Found);
    }

    if (book._count.issues > 0) {
        throw new ErrorResponse("Cannot delete book with active or past issue records", status.Bad_Request);
    }

    await prisma.book.delete({
        where: { id }
    });

    SuccessResponse(res, "Book deleted successfully", null, status.OK);
});
