import express from "express";
import { createFeeStructure, getAllFeeStructures, getFeeStructureById, updateFeeStructure, deleteFeeStructure } from "../controller/fees/FeeStructure.controller.js";
const router = express.Router();
router.post("/", createFeeStructure);
router.get("/", getAllFeeStructures);
router.get("/:id", getFeeStructureById);
router.put("/:id", updateFeeStructure);
router.delete("/:id", deleteFeeStructure);
export default router;
//# sourceMappingURL=feeStructure.routes.js.map