import { asyncHandler } from "../../middleware/error.middleware.js";
import { createExamResultSchema, bulkExamResultSchema, updateExamResultSchema } from "../../validation/ExamResult.validation.js";
import prisma from "../../config/prisma.js";
import { ErrorResponse, SuccessResponse } from "../../utils/response.util.js";
import { statusCode } from "../../types/types.js";
/**
 * @desc    Mark result for a single student
 * @route   POST /api/v1/exam-result/mark
 * @access  Private/Teacher/Admin
 */
export const markExamResult = asyncHandler(async (req, res) => {
    const data = createExamResultSchema.parse(req.body);
    // 1. Verify Exam exists and get Max Marks
    const exam = await prisma.exam.findUnique({ where: { id: data.examId } });
    if (!exam)
        throw new ErrorResponse("Exam not found", statusCode.Not_Found);
    // 2. Validate marks range
    if (data.marksObtained > exam.maxMarks) {
        throw new ErrorResponse(`Marks obtained (${data.marksObtained}) cannot exceed maximum marks (${exam.maxMarks})`, statusCode.Bad_Request);
    }
    // 3. Verify Student exists
    const student = await prisma.student.findUnique({ where: { id: data.studentId } });
    if (!student)
        throw new ErrorResponse("Student not found", statusCode.Not_Found);
    // 4. Upsert result
    const result = await prisma.examResult.upsert({
        where: {
            examId_studentId: {
                examId: data.examId,
                studentId: data.studentId,
            },
        },
        update: {
            marksObtained: data.marksObtained,
            remarks: data.remarks || null,
            absent: data.absent,
        },
        create: {
            examId: data.examId,
            studentId: data.studentId,
            marksObtained: data.marksObtained,
            remarks: data.remarks || null,
            absent: data.absent,
        },
    });
    SuccessResponse(res, "Exam result marked successfully", result, statusCode.OK);
});
/**
 * @desc    Bulk mark results for an exam
 * @route   POST /api/v1/exam-result/bulk
 * @access  Private/Teacher/Admin
 */
export const markBulkExamResults = asyncHandler(async (req, res) => {
    const { examId, results } = bulkExamResultSchema.parse(req.body);
    // 1. Verify Exam
    const exam = await prisma.exam.findUnique({ where: { id: examId } });
    if (!exam)
        throw new ErrorResponse("Exam not found", statusCode.Not_Found);
    // 2. Validate all marks first
    for (const record of results) {
        if (record.marksObtained > exam.maxMarks) {
            throw new ErrorResponse(`Marks for student ${record.studentId} exceed maximum marks`, statusCode.Bad_Request);
        }
    }
    // 3. Transactional Upsert
    const finalResults = await prisma.$transaction(results.map((record) => prisma.examResult.upsert({
        where: {
            examId_studentId: {
                examId: examId,
                studentId: record.studentId,
            },
        },
        update: {
            marksObtained: record.marksObtained,
            remarks: record.remarks || null,
            absent: record.absent,
        },
        create: {
            examId: examId,
            studentId: record.studentId,
            marksObtained: record.marksObtained,
            remarks: record.remarks || null,
            absent: record.absent,
        },
    })));
    SuccessResponse(res, `Results marked for ${finalResults.length} students`, finalResults, statusCode.OK);
});
/**
 * @desc    Get exam results with filters
 * @route   GET /api/v1/exam-result
 * @access  Private
 */
export const getExamResults = asyncHandler(async (req, res) => {
    const { examId, studentId, classId, examTermId } = req.query;
    const whereClause = {};
    if (examId)
        whereClause.examId = String(examId);
    if (studentId)
        whereClause.studentId = String(studentId);
    if (classId || examTermId) {
        whereClause.exam = {};
        if (classId)
            whereClause.exam.classId = String(classId);
        if (examTermId)
            whereClause.exam.examTermId = String(examTermId);
    }
    const results = await prisma.examResult.findMany({
        where: whereClause,
        orderBy: { marksObtained: "desc" },
        include: {
            student: { select: { firstName: true, lastName: true, email: true } },
            exam: {
                include: {
                    subject: { select: { name: true, code: true } },
                    examTerm: { select: { name: true } }
                }
            }
        }
    });
    SuccessResponse(res, "Exam results fetched successfully", results, statusCode.OK);
});
/**
 * @desc    Get result by ID
 * @route   GET /api/v1/exam-result/:id
 * @access  Private
 */
export const getResultById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await prisma.examResult.findUnique({
        where: { id },
        include: {
            student: true,
            exam: {
                include: {
                    subject: true,
                    examTerm: true,
                    class: true
                }
            }
        },
    });
    if (!result)
        throw new ErrorResponse("Result not found", statusCode.Not_Found);
    SuccessResponse(res, "Result details fetched successfully", result, statusCode.OK);
});
/**
 * @desc    Update specific result record
 * @route   PUT /api/v1/exam-result/:id
 * @access  Private/Admin
 */
export const updateResult = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = updateExamResultSchema.parse(req.body);
    const existingResult = await prisma.examResult.findUnique({
        where: { id },
        include: { exam: true }
    });
    if (!existingResult)
        throw new ErrorResponse("Result not found", statusCode.Not_Found);
    if (data.marksObtained && data.marksObtained > existingResult.exam.maxMarks) {
        throw new ErrorResponse(`Marks cannot exceed ${existingResult.exam.maxMarks}`, statusCode.Bad_Request);
    }
    const updatedResult = await prisma.examResult.update({
        where: { id },
        data,
    });
    SuccessResponse(res, "Exam result updated successfully", updatedResult, statusCode.OK);
});
/**
 * @desc    Delete a result record
 * @route   DELETE /api/v1/exam-result/:id
 * @access  Private/Admin
 */
export const deleteResult = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.examResult.delete({
        where: { id },
    });
    SuccessResponse(res, "Result deleted successfully", null, statusCode.OK);
});
//# sourceMappingURL=ExamResult.controller.js.map