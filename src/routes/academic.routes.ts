import express from "express";
import {
    createAcademic,
    deleteAcademic,
    getAllAcademicYears,
    getAcademicYearById,
    updateAcademic,
} from "../controller/student/Academic.controller.js";

const router = express.Router();

router.route("/")
    .post(createAcademic)
    .get(getAllAcademicYears);

router.route("/:id")
    .get(getAcademicYearById)
    .put(updateAcademic)
    .delete(deleteAcademic);

export default router;  