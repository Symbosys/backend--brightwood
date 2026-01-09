import type { Request, Response } from "express";
import { asyncHandler } from "../../middleware/error.middleware.js";
import { createParentSchema, updateParentSchema } from "../../validation/Parent.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";

/**
 * @desc    Create a new parent
 * @route   POST /api/v1/parent/create
 * @access  Private/Admin
 */
export const createParent = asyncHandler(async (req: Request, res: Response) => {
    const { studentIds, ...data } = createParentSchema.parse(req.body);

    // 1. Check if email already exists
    if (data.email) {
        const existingParent = await prisma.parent.findUnique({
            where: { email: data.email },
        });

        if (existingParent) {
            throw new ErrorResponse("Parent with this email already exists", statusCode.Conflict);
        }
    }

    // 2. Create parent and link students if provided
    const parent = await prisma.parent.create({
        data: {
            ...data,
            email: data.email || null,
            phone: data.phone || null,
            address: data.address || null,
            children: studentIds && studentIds.length > 0 ? {
                connect: studentIds.map(id => ({ id }))
            } : undefined
        },
        include: {
            children: true
        }
    });

    SuccessResponse(res, "Parent created successfully", parent, statusCode.Created);
});

/**
 * @desc    Get all parents with pagination and search
 * @route   GET /api/v1/parent
 * @access  Private
 */
export const getAllParents = asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10, search } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const whereClause: any = {};

    if (search) {
        whereClause.OR = [
            { firstName: { contains: String(search) } },
            { lastName: { contains: String(search) } },
            { email: { contains: String(search) } },
            { phone: { contains: String(search) } },
        ];
    }

    const [parents, total] = await Promise.all([
        prisma.parent.findMany({
            where: whereClause,
            skip,
            take: limitNumber,
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: { children: true }
                }
            }
        }),
        prisma.parent.count({ where: whereClause }),
    ]);

    SuccessResponse(
        res,
        "Parents fetched successfully",
        {
            parents,
            meta: {
                page: pageNumber,
                limit: limitNumber,
                total,
                totalPages: Math.ceil(total / limitNumber),
            },
        },
        statusCode.OK
    );
});

/**
 * @desc    Get parent by ID
 * @route   GET /api/v1/parent/:id
 * @access  Private
 */
export const getParentById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const parent = await prisma.parent.findUnique({
        where: { id },
        include: {
            children: {
                include: {
                    school: { select: { name: true } },
                    enrollments: {
                        where: { status: "Active" },
                        include: {
                            section: { include: { class: true } },
                            academicYear: true
                        }
                    }
                }
            }
        },
    });

    if (!parent) throw new ErrorResponse("Parent not found", statusCode.Not_Found);

    SuccessResponse(res, "Parent fetched successfully", parent, statusCode.OK);
});

/**
 * @desc    Update parent info and children links
 * @route   PUT /api/v1/parent/:id
 * @access  Private/Admin
 */
export const updateParent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { studentIds, ...data } = updateParentSchema.parse(req.body);

    const parent = await prisma.parent.findUnique({ where: { id } });
    if (!parent) throw new ErrorResponse("Parent not found", statusCode.Not_Found);

    // Check email uniqueness if email is being updated
    if (data.email && data.email !== parent.email) {
        const existingParent = await prisma.parent.findUnique({
            where: { email: data.email },
        });

        if (existingParent) {
            throw new ErrorResponse("Parent with this email already exists", statusCode.Conflict);
        }
    }

    const updatedParent = await prisma.parent.update({
        where: { id },
        data: {
            ...data,
            children: studentIds ? {
                set: studentIds.map(sid => ({ id: sid }))
            } : undefined
        },
        include: {
            children: true
        }
    });

    SuccessResponse(res, "Parent updated successfully", updatedParent, statusCode.OK);
});

/**
 * @desc    Delete parent
 * @route   DELETE /api/v1/parent/:id
 * @access  Private/Admin
 */
export const deleteParent = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const parent = await prisma.parent.findUnique({ where: { id } });
    if (!parent) throw new ErrorResponse("Parent not found", statusCode.Not_Found);

    await prisma.parent.delete({ where: { id } });

    SuccessResponse(res, "Parent deleted successfully", null, statusCode.OK);
});
