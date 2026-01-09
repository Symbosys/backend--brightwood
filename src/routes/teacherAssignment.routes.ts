import express from "express";
import {
    createAssignment,
    deleteAssignment,
    getAllAssignments,
    getAssignmentById,
    updateAssignment,
} from "../controller/teacher/TeacherAssignment.controller.js";

const router = express.Router();

router.post("/create", createAssignment);
router.get("/", getAllAssignments);

router
    .route("/:id")
    .get(getAssignmentById)
    .put(updateAssignment)
    .delete(deleteAssignment);

export default router;
