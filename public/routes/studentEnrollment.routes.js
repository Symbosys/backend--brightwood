import express from "express";
import { createEnrollment, deleteEnrollment, getAllEnrollments, getEnrollmentById, updateEnrollment, } from "../controller/student/StudentEnrollment.controller.js";
const router = express.Router();
router.post("/create", createEnrollment);
router.get("/", getAllEnrollments);
router
    .route("/:id")
    .get(getEnrollmentById)
    .put(updateEnrollment)
    .delete(deleteEnrollment);
export default router;
//# sourceMappingURL=studentEnrollment.routes.js.map