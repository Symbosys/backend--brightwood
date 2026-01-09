import express from "express";
import { markExamResult, markBulkExamResults, getExamResults, getResultById, updateResult, deleteResult, } from "../controller/school/ExamResult.controller.js";
const router = express.Router();
router.post("/mark", markExamResult);
router.post("/bulk", markBulkExamResults);
router.get("/", getExamResults);
router
    .route("/:id")
    .get(getResultById)
    .put(updateResult)
    .delete(deleteResult);
export default router;
//# sourceMappingURL=examResult.routes.js.map