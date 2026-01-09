import express from "express";
import { createSubject, deleteSubject, getAllSubjects, getSubjectById, updateSubject, } from "../controller/student/Subject.controller.js";
const router = express.Router();
router.post("/create", createSubject);
router.get("/", getAllSubjects);
router
    .route("/:id")
    .get(getSubjectById)
    .put(updateSubject)
    .delete(deleteSubject);
export default router;
//# sourceMappingURL=subject.routes.js.map