import express from "express";
import { createExam, deleteExam, getAllExams, getExamById, updateExam, } from "../controller/school/Exam.controller.js";
const router = express.Router();
router.post("/create", createExam);
router.get("/", getAllExams);
router
    .route("/:id")
    .get(getExamById)
    .put(updateExam)
    .delete(deleteExam);
export default router;
//# sourceMappingURL=exam.routes.js.map