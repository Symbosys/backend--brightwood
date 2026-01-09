import express from "express";
import { createAcademic, deleteAcademic, getAcademic, updateAcademic, } from "../controller/student/Academic.controller.js";
const router = express.Router();
router.route("/").post(createAcademic);
router
    .route("/:id")
    .get(getAcademic)
    .put(updateAcademic)
    .delete(deleteAcademic);
export default router;
//# sourceMappingURL=academic.routes.js.map