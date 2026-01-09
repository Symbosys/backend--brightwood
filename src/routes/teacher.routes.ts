import express from "express";
import { createTeacher, deleteTeacher, getAllTeachers, updateTeacher } from "../controller/teacher/Teacher.controller.js";
const router = express.Router();
router.post("/create", createTeacher)
router.get("/:id", getAllTeachers)
router.put("/update/:id", updateTeacher)
router.delete("/delete/:id", deleteTeacher)





export default router;  