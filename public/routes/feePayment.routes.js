import express from "express";
import { createFeePayment, getAllFeePayments, getFeePaymentById, updateFeePayment, deleteFeePayment } from "../controller/fees/FeePayment.controller.js";
const router = express.Router();
router.post("/", createFeePayment);
router.get("/", getAllFeePayments);
router.get("/:id", getFeePaymentById);
router.patch("/:id", updateFeePayment);
router.delete("/:id", deleteFeePayment);
export default router;
//# sourceMappingURL=feePayment.routes.js.map