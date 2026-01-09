import express from "express";
import {
    assignFeeToStudent,
    getStudentFees,
    getStudentFeeById,
    updateStudentFee,
    deleteStudentFee
} from "../controller/fees/StudentFee.controller.js";

const router = express.Router();

router.post("/", assignFeeToStudent);
router.get("/", getStudentFees);
router.get("/:id", getStudentFeeById);
router.put("/:id", updateStudentFee);
router.delete("/:id", deleteStudentFee);

export default router;
