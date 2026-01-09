import express from "express";
import { markAttendance, markBulkAttendance, getAttendanceRecords, deleteAttendance, } from "../controller/student/StudentAttendance.controller.js";
const router = express.Router();
router.post("/mark", markAttendance);
router.post("/bulk", markBulkAttendance);
router.get("/", getAttendanceRecords);
router.delete("/:id", deleteAttendance);
export default router;
//# sourceMappingURL=studentAttendance.routes.js.map