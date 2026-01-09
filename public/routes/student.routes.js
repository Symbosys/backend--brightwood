import express from "express";
import { createStudent, deleteStudent, getAllStudents, getStudentById, updateStudent, } from "../controller/student/Student.controller.js";
import { studentLogin } from "../controller/student/StudentAuth.controller.js";
const router = express.Router();
router.post("/login", studentLogin);
router.route("/").post(createStudent).get(getAllStudents);
router
    .route("/:id")
    .get(getStudentById)
    .put(updateStudent)
    .delete(deleteStudent);
export default router;
//# sourceMappingURL=student.routes.js.map