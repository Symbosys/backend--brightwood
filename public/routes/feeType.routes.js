import express from "express";
import { createFeeType, getAllFeeTypes, getFeeTypeById, updateFeeType, deleteFeeType } from "../controller/fees/FeeType.controller.js";
const router = express.Router();
router.post("/", createFeeType);
router.get("/", getAllFeeTypes);
router.get("/:id", getFeeTypeById);
router.put("/:id", updateFeeType);
router.delete("/:id", deleteFeeType);
export default router;
//# sourceMappingURL=feeType.routes.js.map