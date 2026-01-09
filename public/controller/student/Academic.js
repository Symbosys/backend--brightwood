import { asyncHandler } from "../../middleware/error.middleware.js";
import { AcademicValidation } from "../../validation/Academic.validation.js";
import prisma from "../../config/prisma.js";
import { SuccessResponse } from "../../utils/response.util.js";
export const createAcademic = asyncHandler(async (req, res) => {
    const data = AcademicValidation.parse(req.body);
    const academicYear = await prisma.academicYear.create({
        data,
    });
    SuccessResponse(res, "Academic Year created successfully", academicYear, 201);
});
export const getAcademic = asyncHandler(async (req, res) => {
    const academicYear = await prisma.academicYear.findMany();
    SuccessResponse(res, "Academic Year fetched successfully", academicYear, 200);
});
export const updateAcademic = asyncHandler(async (req, res) => {
    const data = AcademicValidation.parse(req.body);
    const academicYear = await prisma.academicYear.update({
        where: {
            id: req.params.id,
        },
        data,
    });
    SuccessResponse(res, "Academic Year updated successfully", academicYear, 200);
});
export const deleteAcademic = asyncHandler(async (req, res) => {
    const academicYear = await prisma.academicYear.delete({
        where: {
            id: req.params.id,
        },
    });
    SuccessResponse(res, "Academic Year deleted successfully", academicYear, 200);
});
//# sourceMappingURL=Academic.js.map