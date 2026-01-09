import { asyncHandler } from "../../middleware/error.middleware.js";
import { createExamSchema, updateExamSchema } from "../../validation/Exam.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";
/**
 * @desc    Create a new exam entry
 * @route   POST /api/v1/exam/create
 * @access  Private/Admin
 */
export const createExam = asyncHandler(async (req, res) => {
    const data = createExamSchema.parse(req.body);
    // 1. Verify Exam Term exists
    const examTerm = await prisma.examTerm.findUnique({ where: { id: data.examTermId } });
    if (!examTerm)
        throw new ErrorResponse("Exam term not found", statusCode.Not_Found);
    // 2. Verify Subject exists
    const subject = await prisma.subject.findUnique({ where: { id: data.subjectId } });
    if (!subject)
        throw new ErrorResponse("Subject not found", statusCode.Not_Found);
    // 3. Verify Class exists
    const schoolClass = await prisma.class.findUnique({ where: { id: data.classId } });
    if (!schoolClass)
        throw new ErrorResponse("Class not found", statusCode.Not_Found);
    // 4. Create Exam
    const exam = await prisma.exam.create({
        data,
        include: {
            examTerm: { select: { name: true } },
            subject: { select: { name: true, code: true } },
            class: { select: { name: true } }
        }
    });
    SuccessResponse(res, "Exam scheduled successfully", exam, statusCode.Created);
});
/**
 * @desc    Get all exams with filters
 * @route   GET /api/v1/exam
 * @access  Private
 */
export const getAllExams = asyncHandler(async (req, res) => {
    const { examTermId, subjectId, classId, date } = req.query;
    const whereClause = {};
    if (examTermId)
        whereClause.examTermId = String(examTermId);
    if (subjectId)
        whereClause.subjectId = String(subjectId);
    if (classId)
        whereClause.classId = String(classId);
    if (date) {
        const searchDate = new Date(String(date));
        searchDate.setHours(0, 0, 0, 0);
        whereClause.date = searchDate;
    }
    const exams = await prisma.exam.findMany({
        where: whereClause,
        orderBy: { date: "asc" },
        include: {
            examTerm: { select: { name: true } },
            subject: { select: { name: true, code: true } },
            class: { select: { name: true } },
            _count: { select: { results: true } }
        }
    });
    SuccessResponse(res, "Exams fetched successfully", exams, statusCode.OK);
});
/**
 * @desc    Get exam detail by ID
 * @route   GET /api/v1/exam/:id
 * @access  Private
 */
export const getExamById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const exam = await prisma.exam.findUnique({
        where: { id },
        include: {
            examTerm: {
                include: { academicYear: { select: { name: true } } }
            },
            subject: true,
            class: true,
            results: {
                include: {
                    student: { select: { firstName: true, lastName: true, email: true } }
                }
            }
        },
    });
    if (!exam)
        throw new ErrorResponse("Exam not found", statusCode.Not_Found);
    SuccessResponse(res, "Exam details fetched successfully", exam, statusCode.OK);
});
/**
 * @desc    Update exam details
 * @route   PUT /api/v1/exam/:id
 * @access  Private/Admin
 */
export const updateExam = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = updateExamSchema.parse(req.body);
    const exam = await prisma.exam.findUnique({ where: { id } });
    if (!exam)
        throw new ErrorResponse("Exam not found", statusCode.Not_Found);
    const updatedExam = await prisma.exam.update({
        where: { id },
        data,
        include: {
            subject: { select: { name: true } },
            class: { select: { name: true } }
        }
    });
    SuccessResponse(res, "Exam updated successfully", updatedExam, statusCode.OK);
});
/**
 * @desc    Delete an exam
 * @route   DELETE /api/v1/exam/:id
 * @access  Private/Admin
 */
export const deleteExam = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const exam = await prisma.exam.findUnique({ where: { id } });
    if (!exam)
        throw new ErrorResponse("Exam not found", statusCode.Not_Found);
    await prisma.exam.delete({ where: { id } });
    SuccessResponse(res, "Exam deleted successfully", null, statusCode.OK);
});
//# sourceMappingURL=Exam.controller.js.map