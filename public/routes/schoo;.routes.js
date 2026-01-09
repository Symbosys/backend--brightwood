import express from "express";
import { createSchool, deleteSchool, getAllSchools, getSchoolById, updateSchool } from "../controller/school/School.controller.js";
const router = express.Router();
router.post("/", createSchool);
router.get("/", getAllSchools);
router.get("/:id", getSchoolById);
router.put("/:id", updateSchool);
router.delete("/:id", deleteSchool);
export default router;
//# sourceMappingURL=schoo;.routes.js.map