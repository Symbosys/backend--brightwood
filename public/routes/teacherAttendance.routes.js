import express from "express";
import { markTeacherAttendance, getTeacherAttendanceRecords, deleteTeacherAttendance, } from "../controller/teacher/TeacherAttendance.controller.js";
const router = express.Router();
router.post("/mark", markTeacherAttendance);
router.get("/", getTeacherAttendanceRecords);
router.delete("/:id", deleteTeacherAttendance);
export default router;
//# sourceMappingURL=teacherAttendance.routes.js.map