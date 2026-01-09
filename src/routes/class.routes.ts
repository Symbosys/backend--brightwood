import express from "express";
import { createClass, deleteClass, getAllClasses, getClassById, updateClass } from "../controller/student/Class.controller.js";


const router = express.Router();

router.post("/", createClass);
router.get("/", getAllClasses);
router.get("/:id", getClassById);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);

export default router;  