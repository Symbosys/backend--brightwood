import express from "express";
import { createParent, deleteParent, getAllParents, getParentById, updateParent, } from "../controller/parents/Parent.controller.js";
const router = express.Router();
router.post("/create", createParent);
router.get("/", getAllParents);
router
    .route("/:id")
    .get(getParentById)
    .put(updateParent)
    .delete(deleteParent);
export default router;
//# sourceMappingURL=parent.routes.js.map