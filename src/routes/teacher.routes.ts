import express from "express";
import { createTeacher, deleteTeacher, getAllTeachers, getTeacherById, updateTeacher } from "../controller/teacher/Teacher.controller.js";
import { teacherLogin } from "../controller/teacher/TeacherAuth.controller.js";
const router = express.Router();
router.post("/login", teacherLogin)
router.post("/", createTeacher)
router.get("/", getAllTeachers)
router.get("/:id", getTeacherById)
router.put("/:id", updateTeacher)
router.delete("/:id", deleteTeacher)





export default router;  