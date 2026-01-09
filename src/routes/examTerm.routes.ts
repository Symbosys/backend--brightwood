import express from "express";
import {
    createExamTerm,
    deleteExamTerm,
    getAllExamTerms,
    getExamTermById,
    updateExamTerm,
} from "../controller/school/ExamTerm.controller.js";

const router = express.Router();

router.post("/create", createExamTerm);
router.get("/", getAllExamTerms);

router
    .route("/:id")
    .get(getExamTermById)
    .put(updateExamTerm)
    .delete(deleteExamTerm);

export default router;
